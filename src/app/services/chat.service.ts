import { EventEmitter, Inject, Injectable, NgZone, Optional, Output } from "@angular/core";
import * as signalR from '@microsoft/signalr';
import * as moment from "moment";
import { ChatApiService, ConversationModel, MessageModel, WISH_API_URL } from "./api-wishalink.service";
import { AppService } from "./app.service";

@Injectable({
    providedIn: "root",
})
export class ChatService {

    @Output() onConversationsChanged = new EventEmitter<any>();
    @Output() onNewMessage = new EventEmitter<any>();
    @Output() onMessagesRead = new EventEmitter<any>();

    baseUrl: string;
    connection: signalR.HubConnection;
    isInitialized: boolean = false;
    connectionId: string;
    conversations: ConversationModel[] = [];
    conversationMessages: { [id: number]: MessageModel[] } = {};
    isConversationsLoading: boolean;

    constructor(
        private zone: NgZone,
        private appService: AppService,
        private chatApiService: ChatApiService,
        @Optional() @Inject(WISH_API_URL) baseUrl?: string
    ) {
        this.baseUrl = baseUrl;
        if (!this.isInitialized) {
            this.init().then(x => {
                this.isInitialized = true;
                this.setClientMethods();
            });
        }
    }

    private init(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.appService.user == null) reject();

            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(this.baseUrl + '/chat?token=' + this.appService.accessToken)
                .build();

            this.connection
                .start()
                .then(() => {
                    console.log(`ConnectionId: ${this.connection.connectionId} `);
                    resolve();
                })
                .catch((error) => {
                    console.log(`Connection error: ${error}`);
                    reject();
                });
        });
    }



    private setClientMethods() {
        this.connection.on("setConnectionId", (connectionId: string) => {
            this.connectionId = connectionId;

            this.loadConversations();
        })

        this.connection.on("newConversation", (connectionId: string) => {
            this.loadConversations();
        })

        this.connection.on("newMessage", (message: MessageModel) => {
            this.addConversationMessage(message);

            const conversation = this.conversations.find(x => x.id == message.conversationId);

            if(conversation == undefined) {
                this.loadConversations();
            }
            else {
                if(message.receiverId == this.appService.user.id) {
                    conversation.unreadMessageCount++;
                }
                conversation.totalMessageCount++;
            }

            this.zone.run(() => {
                this.onNewMessage.emit();
            })
        })


    }

    addConversationMessage(message: MessageModel) {
        if (this.conversationMessages[message.conversationId] == undefined) {
            this.conversationMessages[message.conversationId] = [];
        }

        if (this.conversationMessages[message.conversationId].find(x => x.id == message.id) != null) {
            return;
        }

        this.conversationMessages[message.conversationId].push(message);
        this.conversationMessages[message.conversationId] =
            this.conversationMessages[message.conversationId]
                .sort((a, b) => a.id - b.id)

    }

    getUnreadMessageCount() {
        return this.conversations.map(a => (a.unreadMessageCount ?? 0)).reduce((a, b) => a + b, 0);
    }

    private loadConversations() {
        if(this.isConversationsLoading) return;

        this.isConversationsLoading = true;
        this.chatApiService.conversations()
            .subscribe(
                v => {
                    this.isConversationsLoading = false;

                    this.zone.run(() => {
                        this.conversations = v;
                        this.onConversationsChanged.emit();
                    })

                },
                e => {
                    this.isConversationsLoading = false;
                    console.log(e)
                }
            )
    }
}