import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private userService = inject(UserService);

  isLoggedIn$: Observable<boolean> = this.auth.isLoggedIn();


  backendUrl = 'https://vps-ff89e3e0.vps.ovh.net';
  defaultAvatar = 'https://pentaxcenter.com/wp-content/uploads/no-user-image-square.jpg';
  user: any = null;
  showDropdown = false;

  ngOnInit() {
    this.userService.watchCurrentUser$().subscribe(user => {
      this.user = user;
    });
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

  logout() {
    this.auth.logout().subscribe(() => {
      localStorage.clear();
      this.router.navigate(['/login']);
    });
  }
}
