import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { LikeService } from '../../services/like/like.service';
import { UserCardComponent } from '../../shared/user-card/user-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, UserCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private userService = inject(UserService);
  private likeService = inject(LikeService);

  users: any[] = [];
  loading = true;
goToMessagesHandler: any;

  ngOnInit() {
    this.loading = true;

    this.userService.watchCurrentUser$().subscribe(currentUser => {
      if (!currentUser) return;

      this.userService.getUsers().subscribe({
        next: (res) => {
          this.users = res.users.filter((user: any) => user.email !== currentUser.email);

          this.likeService.getLikes().subscribe((likeRes) => {
            const likedUserIds = likeRes.likes.map(like => like.liked_user_id);
            this.users = this.users.map(user => ({
              ...user,
              liked: likedUserIds.includes(user.id)
            }));
            this.loading = false;
          });
        },
        error: () => {
          this.loading = false;
        }
      });
    });
  }

  toggleLike(user: any) {
    if (user.liked) {
      this.likeService.unlikeUser(user.id).subscribe(() => {
        user.liked = false;
      });
    } else {
      this.likeService.likeUser(user.id).subscribe(() => {
        user.liked = true;
      });
    }
  }

  goToMessages(userId: number) {
    console.log('Abrir chat con usuario ID:', userId);
  }
}
