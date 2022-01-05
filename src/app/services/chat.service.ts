import { EventEmitter, Inject, Injectable, NgZone, Optional, Output } from "@angular/core";
import * as signalR from '@microsoft/signalr';
import * as moment from "moment";
import { ChatApiService, MessageModel, RoomListModel, WISH_API_URL } from "./api-wishalink.service";
import { AppService } from "./app.service";

@Injectable({
    providedIn: "root",
})
export class ChatService {

    @Output() onRoomsChanged = new EventEmitter<any>();
    @Output() onNewMessage = new EventEmitter<any>();

    baseUrl: string;
    connection: signalR.HubConnection;
    isInitialized: boolean = false;
    connectionId: string;
    rooms: RoomListModel[] = [];
    roomMessages:  { [id: number] : MessageModel[] } = {};

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

            this.loadRooms();
        })

        this.connection.on("newMessage", (message: MessageModel) => {
            this.addRoomMessage(message);
            
            this.zone.run(()=>{
                this.onNewMessage.emit();
            })
        })

        
    }

    addRoomMessage(message: MessageModel) {
        if(this.roomMessages[message.roomId] == undefined) {
            this.roomMessages[message.roomId] = [];
        }

        if(this.roomMessages[message.roomId].find(x => x.id == message.id) != null)
        {
            return;
        }

        this.roomMessages[message.roomId].push(message);
        this.roomMessages[message.roomId] = 
            this.roomMessages[message.roomId]
                .sort((a, b) => a.id - b.id)

    }
    
    private loadRooms() {
        this.chatApiService.getrooms(this.connectionId)
            .subscribe(
                v => {
                    this.zone.run(()=>{
                        this.rooms = v;
                        this.onRoomsChanged.emit();
                    })
                    
                },
                e => console.log(e)
            )
    }
}