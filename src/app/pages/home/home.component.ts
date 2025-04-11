import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  users: any[] = [];
  loggedUser: any = {};
  loading = true;

  ngOnInit() {
    this.loggedUser = this.authService.getLoggedUser();

    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users = res.users.filter((user: any) => user.id !== this.loggedUser.id);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
