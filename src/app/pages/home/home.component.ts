import { Component, ElementRef, HostListener, ViewChild, OnInit, inject } from '@angular/core';
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
  private elementRef = inject(ElementRef);

  @ViewChild('filterRef') filterRef!: ElementRef;

  users: any[] = [];
  gyms: any[] = [];
  filteredUsers: any[] = [];
  selectedGymId: number | null = null;
  loading = true;
  showFilter = false;

  ngOnInit() {
    this.loading = true;

    this.gymService.getGyms().subscribe({
      next: res => {
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
            this.filteredUsers = [...this.users];
            this.loading = false;
          });
        },
        error: () => {
          this.loading = false;
        }
      });
    });
  }

  iconName = 'filter_list';
  toggleFilter() {
    this.showFilter = !this.showFilter;
    this.iconName = this.showFilter ? 'close' : 'filter_list';
  }

  onGymChange() {
    if (this.selectedGymId) {
      this.filteredUsers = this.users.filter(user => user.gym_id === this.selectedGymId);
    } else {
      this.filteredUsers = [...this.users];
    }
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

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.filterRef && !this.filterRef.nativeElement.contains(target)) {
      this.showFilter = false;
    }
  }
}
