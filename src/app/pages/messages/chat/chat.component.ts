import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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

  currentUser: any;
  receiverId!: number;
  messages: any[] = [];
  newMessage: string = '';
  loading = true;

  ngOnInit() {
    this.receiverId = Number(this.route.snapshot.paramMap.get('id'));
    this.currentUser = this.userService.getCurrentUser();

    this.messageService.getMessages().subscribe({
      next: (res) => {
        this.messages = res.messages.filter((msg: any) => {
          return (
            (msg.sender_id === this.currentUser.id && msg.receiver_id === this.receiverId) ||
            (msg.sender_id === this.receiverId && msg.receiver_id === this.currentUser.id)
          );
        });

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.messageService.sendMessage(this.receiverId, this.newMessage).subscribe({
      next: (res) => {
        this.messages.push(res.message);
        this.newMessage = '';
      }
    });
  }
}
