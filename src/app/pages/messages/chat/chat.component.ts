import { Component, inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../../services/message/message.service';
import { UserService } from '../../../services/user/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private userService = inject(UserService);
  router = inject(Router);

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  currentUser: any;
  receiverId!: number;
  receiverUser: any = null;
  messages: any[] = [];
  newMessage: string = '';
  loading = true;

  backendUrl = 'https://vps-ff89e3e0.vps.ovh.net/uploads/';
  defaultAvatar = 'https://pentaxcenter.com/wp-content/uploads/no-user-image-square.jpg';

  ngOnInit() {
    this.receiverId = Number(this.route.snapshot.paramMap.get('id'));
    this.currentUser = this.userService.getCurrentUser();

    this.userService.getUsers().subscribe({
      next: (res) => {
        this.receiverUser = res.users.find((u: any) => u.id === this.receiverId);
      }
    });

    this.messageService.getMessages().subscribe({
      next: (res) => {
        this.messages = res.messages.filter((msg: any) => {
          return (
            (msg.sender_id === this.currentUser.id && msg.receiver_id === this.receiverId) ||
            (msg.sender_id === this.receiverId && msg.receiver_id === this.currentUser.id)
          );
        });
        this.loading = false;
        this.scrollToBottom();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 0);
  }

    sendMessage() {
      if (!this.newMessage.trim()) return;

      this.messageService.sendMessage(this.receiverId, this.newMessage).subscribe({
        next: (res) => {
          this.messages.push(res.message);
          this.newMessage = '';
          this.scrollToBottom();
        }
      });
    }

    markMessagesAsRead() {
    const unreadMessages = this.messages.filter(
      msg => msg.receiver_id === this.currentUser.id && !msg.read
    );

    unreadMessages.forEach(msg => {
      this.messageService.markAsRead(msg.id).subscribe();
      msg.read = true;
    });
  }

}
