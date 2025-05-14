import { Component, inject, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { MessageService } from '../../services/message/message.service';
import { Observable, interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  private auth = inject(AuthService);
  private router = inject(Router);
  private userService = inject(UserService);
  private messageService = inject(MessageService);

  isLoggedIn$: Observable<boolean> = this.auth.isLoggedIn();

  backendUrl = 'https://vps-ff89e3e0.vps.ovh.net';
  defaultAvatar = 'https://pentaxcenter.com/wp-content/uploads/no-user-image-square.jpg';
  user: any = null;
  showDropdown = false;
  hasUnreadMessages = false;

  private pollingSub: Subscription | null = null;

  ngOnInit() {
    this.userService.watchCurrentUser$().subscribe(user => {
      this.user = user;
    });

    this.pollingSub = interval(3000).subscribe(() => {
      this.messageService.getUnreadMessages().subscribe({
        next: (res) => {
          this.hasUnreadMessages = res.messages.length > 0;
        }
      });
    });
  }

  ngOnDestroy() {
    this.pollingSub?.unsubscribe();
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.avatar-container')) {
      this.showDropdown = false;
    }
  }


}
