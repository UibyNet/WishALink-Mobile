import { Location } from "@angular/common";
import { Component, NgZone, OnInit, ViewChild } from "@angular/core";
import {
  ActivatedRoute,
  Event,
  NavigationStart,
  Router,
} from "@angular/router";
import { NavController } from "@ionic/angular";
import * as moment from "moment";
import {
  ChatApiService,
  ConversationModel,
  MessageModel
} from "src/app/services/api-wishalink.service";
import { AppService } from "src/app/services/app.service";
import { ChatService } from "src/app/services/chat.service";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.page.html",
  styleUrls: ["./chat.page.scss"],
})
export class ChatPage implements OnInit {
  @ViewChild("chatContent", { static: false }) private chatContent: any;
  @ViewChild("chatMenu", { static: false }) private chatMenu: any;

  currentConversationId: number;
  currentConversation: ConversationModel;
  currentConversationMessages: MessageModel[];
  currentConversationHasMoreMessages: boolean = false;

  newMessage: string = "";
  isSending: boolean;
  isLoading: boolean;
  currentUserId: number;


  get conversations() {
    return this.chatService.conversations.map(x => {
      const messages = this.chatService.conversationMessages[x.id];
      if (messages != undefined && messages.length > 0) {
        x.totalMessageCount = messages.length;
        x.unreadMessageCount = messages.filter(x => x.receiverId == this.appService.user.id && !x.isRead).length;
        x.lastMessageDate = messages.sort((a, b) => moment(a.createdOn, 'DD.MM.YYYY HH:mm:ss').unix() - moment(b.createdOn, 'DD.MM.YYYY HH:mm:ss').unix() > 0 ? 1 : -1)[0]?.createdOn ?? '01.01.2000';
      }
      return x;
    })
      .sort((a, b) => moment(a.lastMessageDate, 'DD.MM.YYYY HH:mm:ss').unix() - moment(b.lastMessageDate, 'DD.MM.YYYY HH:mm:ss').unix() > 0 ? 1 : -1);
  }

  constructor(
    public chatService: ChatService,
    private chatApiService: ChatApiService,
    private zone: NgZone,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private navController: NavController
  ) {
  }

  ionViewWillEnter() {

    this.appService.toggleStatusBar("dark");
    this.appService.setStatusBarBackground("primary");
    this.appService.isTabBarHidden = true;

    this.currentUserId = this.appService.user.id;

    this.currentConversationId = parseInt(this.route.snapshot.params.id);

    if (this.currentConversationId > 0) {
      this.loadConversation(this.currentConversationId);
    } else {
      this.chatMenu.open();
    }

    this.location.onUrlChange((u, s) => {
      this.currentConversationId = parseInt(u.replace("/app/chat/", ""));
      this.loadConversation(this.currentConversationId);
    });

    this.chatService.onConversationsChanged.subscribe(() => {
      if (this.currentConversation == null) {
        this.loadConversation(this.currentConversationId);
      }
    });

    this.chatService.onNewMessage.subscribe(() => {
      if (this.currentConversationMessages != null) {
        this.currentConversationMessages = this.chatService.conversationMessages[this.currentConversation.id];
        setTimeout(() => {
          this.zone.run(() => {
            this.markMessagesAsRead();
            this.chatContent.scrollToBottom();
          });
        }, 200);
      }
    });
  }

  ionViewWillLeave() {
    this.appService.isTabBarHidden = false;
  }

  ngOnInit() { }

  close() {
    this.navController.back();
  }

  changeConversation(conversation: ConversationModel) {
    if (this.isSending) return;
    if (this.isLoading) return;

    this.location.replaceState("/app/chat/" + conversation.id);
  }

  loadConversation(conversationId: number) {
    if (this.currentConversation?.id === conversationId) return;

    this.zone.run(() => {
      this.resetConversation();

      this.currentConversation = this.chatService.conversations.find((x) => x.id == conversationId);

      this.markMessagesAsRead();

      if (this.currentConversation != null) {
        this.currentConversationMessages =
          this.chatService.conversationMessages[this.currentConversation.id];

        if (
          this.currentConversationMessages == null ||
          this.currentConversationMessages.length == 0
        ) {
          this.loadMessages();
        }
      }
      else {
        if (this.currentConversationId > 0) {
          this.appService.toggleLoader().then(
            v => {
              this.chatApiService
                .getconversationbyid(this.currentConversationId)
                .subscribe((v) => {
                  this.zone.run(() => {
                    this.appService.toggleLoader(false);
                    if (this.chatService.conversations.find((x) => x.id == v.id) == null) {
                      this.chatService.conversations.push(v);
                    }
                    this.currentConversation = this.chatService.conversations.find((x) => x.id == conversationId);
                    this.loadMessages();
                  });
                });
            }
          )
        }

      }

      setTimeout(() => {
        this.zone.run(() => {
          this.chatContent.scrollToBottom(100);
        });
      }, 200);
    });
  }

  markMessagesAsRead() {
    if (this.currentConversation != undefined && this.currentConversation.unreadMessageCount > 0) {
      this.chatApiService.markmessagesasread(this.currentConversation.id)
        .subscribe(
          v => {
            const messages = this.chatService.conversationMessages[this.currentConversationId];
            if (messages != null && messages.length > 0) {
              this.chatService.onMessagesRead.emit();
              this.chatService.conversationMessages[this.currentConversationId] = messages.map(x => { x.isRead = true; return x });
            }
          }
        )
      this.currentConversation.unreadMessageCount = 0;
    }
  }

  leaveConversation() {
    const currentConversationId = this.currentConversation.id;

    this.chatApiService
      .deleteconversation(currentConversationId)
      .subscribe((v) => {
        this.location.replaceState("/app/chat/0");
        this.resetConversation();

        this.zone.run(() => {
          this.chatService.conversationMessages[currentConversationId] = [];
          this.chatService.conversations = this.chatService.conversations.filter(
            (x) => x.id != currentConversationId
          );
        });

        setTimeout(() => {
          this.focusInput();
        }, 100);
      });
  }

  resetConversation() {
    this.zone.run(() => {
      this.newMessage = "";
      this.currentConversationHasMoreMessages = false;
      this.currentConversationMessages = null;
      this.currentConversation = null;
      this.focusInput();
    });
  }

  focusInput() {
    const input = document.querySelector(
      "#newMessageInput input"
    ) as HTMLElement;
    if (input) {
      this.zone.run(() => {
        input.focus();
      });
    }
  }

  sendMessage() {
    this.isSending = true;

    var messageModel = new MessageModel();
    messageModel.senderId = this.appService.user.id;
    messageModel.receiverId = this.currentConversation.receiverId;
    messageModel.conversationId = this.currentConversation.id;
    messageModel.content = this.newMessage;
    this.chatApiService.createmessage(messageModel).subscribe((v) => {
      this.zone.run(() => {
        this.newMessage = "";
        this.isSending = false;

        if (
          this.currentConversationMessages == undefined ||
          this.currentConversationMessages.length == 0
        ) {
          this.loadMessages();
        }
        setTimeout(() => {
          this.zone.run(() => {
            this.chatContent.scrollToBottom();
          });
        }, 200);
      });

      setTimeout(() => {
        this.focusInput();
      }, 100);
    });
  }

  loadMessages() {
    let minMessageId = 0;

    if (
      this.currentConversationMessages != undefined &&
      this.currentConversationMessages.length > 0
    ) {
      minMessageId = this.currentConversationMessages
        .map((x) => x.id)
        .sort((a, b) => a - b)[0];
    }

    this.isLoading = true;
    this.chatApiService
      .getmessages(this.currentConversation.id, minMessageId)
      .subscribe((v) => {
        this.zone.run(() => {
          this.isLoading = false;

          if (
            v != undefined &&
            v.messages != undefined &&
            v.messages.length > 0
          ) {
            for (let i = 0; i < v.messages.length; i++) {
              const message = v.messages[i];
              this.chatService.addConversationMessage(message);
            }
          }

          this.currentConversationMessages = this.chatService.conversationMessages[v.id];
          //   console.log("halil ", this.currentConversationMessages);

          //   this.currentConversationMessages.forEach((element) => {
          //     var urlCheck =
          //       /(([a-zA-Z0-9]+:\/\/)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\.[A-Za-z]{2,4})(:[0-9]+)?(\/.*)?)/;
          //     let b = element.content.replace(urlCheck, "<a>$1</a>");
          //     element.content = b;
          //     console.log("aa ", b);
          //   });

          //   var urlRE = new RegExp(
          //     "([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+"
          //   );
          //   this.currentConversationMessages.forEach((element) => {
          //     let a = element.content.match(urlRE);
          //     console.log("ss ", a);
          //   });
          this.currentConversationHasMoreMessages = v.hasMore;
          setTimeout(() => {
            this.zone.run(() => {
              this.chatContent.scrollToBottom();
            });
          }, 200);
        });
      });
  }
}
