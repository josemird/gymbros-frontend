import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from '../../services/message/message.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent implements OnInit {
  private messageService = inject(MessageService);
  private userService = inject(UserService);
  private router = inject(Router);

  currentUser: any;
  conversations: any[] = [];
  loading = true;

  ngOnInit() {
    this.loading = true;
    this.currentUser = this.userService.getCurrentUser();

    this.messageService.getMessages().subscribe({
      next: (res) => {
        const uniqueUsers: { [key: number]: any } = {};

        res.messages.forEach((msg: any) => {
          const otherUser = msg.sender_id === this.currentUser.id ? msg.receiver : msg.sender;

          if (!uniqueUsers[otherUser.id]) {
            uniqueUsers[otherUser.id] = otherUser;
          }
        });

        this.conversations = Object.values(uniqueUsers);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  openChat(userId: number) {
    this.router.navigate(['/messages', userId]);
  }
}
