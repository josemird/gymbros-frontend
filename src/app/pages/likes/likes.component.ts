import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LikeService } from '../../services/like/like.service';
import { UserCardComponent } from '../../shared/user-card/user-card.component';

@Component({
  selector: 'app-likes',
  standalone: true,
  imports: [CommonModule, UserCardComponent],
  templateUrl: './likes.component.html',
  styleUrl: './likes.component.scss'
})
export class LikesComponent implements OnInit {
  private likeService = inject(LikeService);

  likedUsers: any[] = [];
  loading = true;

  ngOnInit() {
    this.loading = true;

    this.likeService.getLikes().subscribe({
      next: (res) => {
        this.likedUsers = res.likes.map(like => ({
          ...like['liked_user'],
          liked: true,
          liked_user_id: like.liked_user_id
        }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  toggleLike(user: any) {
    this.likeService.unlikeUser(user.liked_user_id).subscribe(() => {
      this.likedUsers = this.likedUsers.filter(u => u.id !== user.id);
    });
  }

  goToMessages(userId: number) {
    console.log('Abrir chat con usuario ID:', userId);
  }
}
