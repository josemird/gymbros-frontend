import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { LikeService } from '../../services/like/like.service';
import { GymService } from '../../services/gym/gym.service';
import { UserCardComponent } from '../../shared/user-card/user-card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, UserCardComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private userService = inject(UserService);
  private likeService = inject(LikeService);
  private gymService = inject(GymService);

  users: any[] = [];
  filteredUsers: any[] = [];
  gyms: any[] = [];
  selectedGymId: number | null = null;
  loading = true;

  ngOnInit() {
    this.loading = true;

      this.gymService.getGyms().subscribe({
      next: (res) => {
        this.gyms = res.gyms;
      }
    });

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
            this.applyFilter();
            this.loading = false;
          });
        },
        error: () => {
          this.loading = false;
        }
      });
    });
  }

    applyFilter() {
    if (this.selectedGymId) {
      this.filteredUsers = this.users.filter(u => u.gym?.id === this.selectedGymId);
    } else {
      this.filteredUsers = [...this.users];
    }
  }

  onGymChange() {
    this.applyFilter();
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

}
