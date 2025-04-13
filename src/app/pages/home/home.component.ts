import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private userService = inject(UserService);
  private authService = inject(AuthService);

  users: any[] = [];
  loading = true;
  loggedUser: any = {};

  ngOnInit() {

    this.userService.getUsers().subscribe({
      next: (res) => {
        const currentEmail = this.authService.getUserEmail();
        this.users = res.users.filter((user: any) => user.email !== currentEmail);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
