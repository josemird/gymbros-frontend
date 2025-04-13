import { Component, OnInit, inject } from '@angular/core';
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
  currentUserId: number | null = null;
  loading = true;

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.currentUserId = user.id;
        this.loadUsers();
      },
      error: () => {
        console.error('Error al obtener el usuario actual');
        this.loading = false;
      }
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (allUsers) => {
        this.users = allUsers.filter((user: { id: number | null; }) => user.id !== this.currentUserId);
        this.loading = false;
      },
      error: () => {
        console.error('Error al cargar los usuarios');
        this.loading = false;
      }
    });
  }
}
