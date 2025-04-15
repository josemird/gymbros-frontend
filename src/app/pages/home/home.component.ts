import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private userService = inject(UserService);

  users: any[] = [];
  loading = true;
form: any;

  ngOnInit() {
    this.loading = true;

    this.userService.watchCurrentUser$().subscribe(currentUser => {
      if (!currentUser) return;

      this.userService.getUsers().subscribe({
        next: (res) => {
          this.users = res.users.filter((user: any) => user.email !== currentUser.email);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    });
  }
}
