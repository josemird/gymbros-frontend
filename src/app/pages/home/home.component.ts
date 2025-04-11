import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';

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
  loggedUser: any = {};
  loading = true;

  ngOnInit() {

    const loggedUser = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(loggedUser);

    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users = res.users.filter((user: any) => user.id !== loggedUser.id);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
