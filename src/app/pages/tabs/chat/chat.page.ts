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
  MessageModel,
  RoomListModel,
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

  currentRoom: RoomListModel;
  currentRoomMessages: MessageModel[];
  currentRoomHasMoreMessages: boolean = false;

  newMessage: string = "";
  isSending: boolean;
  isLoading: boolean;
  currentUserId: number;

  constructor(
    public chatService: ChatService,
    private chatApiService: ChatApiService,
    private zone: NgZone,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private navController: NavController
  ) {}

  ionViewWillEnter() {
    this.appService.toggleStatusBar("dark");
    this.appService.setStatusBarBackground("primary");
    this.appService.isTabBarHidden = true;

    this.currentUserId = this.appService.user.id;

    const routedRoomId = parseInt(this.route.snapshot.params.id);

    if (routedRoomId > 0) {
      this.loadRoom(routedRoomId);
    } else {
      this.chatMenu.open();
    }

    this.location.onUrlChange((u, s) => {
      var roomId = parseInt(u.replace("/app/chat/", ""));
      this.loadRoom(roomId);
    });

    this.chatService.onRoomsChanged.subscribe(() => {
      if (this.currentRoom == null) {
        this.loadRoom(routedRoomId);
      }
    });

    this.chatService.onNewMessage.subscribe(() => {
      this.currentRoomMessages =
        this.chatService.roomMessages[this.currentRoom.id];
      setTimeout(() => {
        this.zone.run(() => {
          this.chatContent.scrollToBottom();
        });
      }, 200);
    });
  }

  ionViewWillLeave() {
    this.appService.isTabBarHidden = false;
  }

  ngOnInit() {}

  close() {
    this.navController.back();
  }

  changeRoom(room: RoomListModel) {
    if (this.isSending) return;
    if (this.isLoading) return;

    this.location.replaceState("/app/chat/" + room.id);
  }

  loadRoom(roomId: number) {
    if (this.currentRoom?.id === roomId) return;

    this.zone.run(() => {
      this.resetRoom();

      this.currentRoom = this.chatService.rooms.find((x) => x.id == roomId);
      if (this.currentRoom != null) {
        this.currentRoomMessages =
          this.chatService.roomMessages[this.currentRoom.id];

        if (
          this.currentRoomMessages == null ||
          this.currentRoomMessages.length == 0
        ) {
          this.loadMessages();
        }
      }

      setTimeout(() => {
        this.zone.run(() => {
          this.chatContent.scrollToBottom(100);
        });
      }, 200);
    });
  }

  leaveRoom() {
    const roomToLeaveId = this.currentRoom.id;

    this.chatApiService
      .leaveroom(roomToLeaveId, this.chatService.connectionId)
      .subscribe((v) => {
        this.location.replaceState("/app/chat/0");
        this.resetRoom();

        this.zone.run(() => {
          this.chatService.rooms = this.chatService.rooms.filter(
            (x) => x.id != roomToLeaveId
          );
        });

        setTimeout(() => {
          this.focusInput();
        }, 100);
      });
  }

  resetRoom() {
    this.zone.run(() => {
      this.newMessage = "";
      this.currentRoomHasMoreMessages = false;
      this.currentRoomMessages = null;
      this.currentRoom = null;
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
    messageModel.fromId = this.appService.user.id;
    messageModel.roomId = this.currentRoom.id;
    messageModel.content = this.newMessage;
    this.chatApiService.createmessage(messageModel).subscribe((v) => {
      this.zone.run(() => {
        this.newMessage = "";
        this.isSending = false;

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
      this.currentRoomMessages != undefined &&
      this.currentRoomMessages.length > 0
    ) {
      minMessageId = this.currentRoomMessages
        .map((x) => x.id)
        .sort((a, b) => a - b)[0];
    }

    this.isLoading = true;
    this.chatApiService
      .getmessages(this.currentRoom.id, minMessageId)
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
              this.chatService.addRoomMessage(message);
            }
          }

          this.currentRoomMessages = this.chatService.roomMessages[v.id];
          //   console.log("halil ", this.currentRoomMessages);

          //   this.currentRoomMessages.forEach((element) => {
          //     var urlCheck =
          //       /(([a-zA-Z0-9]+:\/\/)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\.[A-Za-z]{2,4})(:[0-9]+)?(\/.*)?)/;
          //     let b = element.content.replace(urlCheck, "<a>$1</a>");
          //     element.content = b;
          //     console.log("aa ", b);
          //   });

          //   var urlRE = new RegExp(
          //     "([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+"
          //   );
          //   this.currentRoomMessages.forEach((element) => {
          //     let a = element.content.match(urlRE);
          //     console.log("ss ", a);
          //   });
          this.currentRoomHasMoreMessages = v.hasMore;
          setTimeout(() => {
            this.zone.run(() => {
              this.chatContent.scrollToBottom();
            });
          }, 200);
        });
      });
  }
}
