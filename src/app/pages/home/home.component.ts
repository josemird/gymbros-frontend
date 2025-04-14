import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private userService = inject(UserService);

  users: any[] = [];
  loading = true;

  ngOnInit() {
    combineLatest([
      this.userService.watchCurrentUser$(),
      this.userService.getUsers()
    ]).subscribe({
        next:([currentUser, res]) => {
          this.users = res.users.filter((user: any) => user.email !== currentUser?.email);
          this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
