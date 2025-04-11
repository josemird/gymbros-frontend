import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';  // Inyectamos AuthService

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);  // Inyectamos AuthService
  users: any[] = [];
  loading = true;
  loggedUser: any = {};  // Variable para almacenar el usuario logueado

  ngOnInit() {
    // Obtener el usuario logueado desde AuthService
    this.loggedUser = this.authService.getLoggedUser();  // Usamos el servicio para obtener el usuario logueado

    if (this.loggedUser) {
      // Obtener la lista de usuarios desde la API
      this.userService.getUsers().subscribe({
        next: (res) => {
          // Filtrar la lista de usuarios excluyendo al usuario logueado
          this.users = res.users.filter((user: any) => user.id !== this.loggedUser.id);
          this.loading = false;

          console.log('Usuario logueado:', this.loggedUser);
          console.log('Usuarios de la API:', res.users);
          console.log('Usuarios filtrados:', this.users);
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      console.error("El usuario no está logueado.");
      this.loading = false;
    }
  }
}
