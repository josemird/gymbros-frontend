import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from '../../services/message/message.service';
import { UserService } from '../../services/user/user.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent implements OnInit, OnDestroy {
  private messageService = inject(MessageService);
  private userService = inject(UserService);
  private router = inject(Router);

  currentUser: any;
  conversations: any[] = [];
  unreadCountsMap: { [key: number]: number } = {};
  loading = true;

  private pollingSub: Subscription | null = null;

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
        this.fetchUnreadCounts();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    this.pollingSub = interval(3000).subscribe(() => {
      this.fetchUnreadCounts();
    });
  }

  ngOnDestroy() {
    this.pollingSub?.unsubscribe();
  }

  fetchUnreadCounts() {
    this.messageService.getUnreadCounts().subscribe({
      next: (res) => {
        this.unreadCountsMap = {};
        res.counts.forEach((entry: any) => {
          this.unreadCountsMap[entry.sender_id] = entry.count;
        });
      }
    });
  }

  hasUnread(userId: number): boolean {
    return this.unreadCountsMap[userId] > 0;
  }

  openChat(userId: number) {
    this.router.navigate(['/messages', userId]);
  }
}
