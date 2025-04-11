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
        this.users = res.users;
        this.loading = false;

        console.log(this.users); // Verifica que los usuarios se están obteniendo correctamente
        console.log(this.loggedUser); // Verifica que el usuario logueado se está obteniendo correctamente
        console.log(this.authService.getLoggedUser()); // Verifica que el usuario logueado se está obteniendo correctamente desde el servicio
        console.log(this.authService.getToken()); // Verifica que el token se está obteniendo correctamente desde el servicio
        console.log(this.authService.isLoggedIn()); // Verifica que el estado de autenticación se está obteniendo correctamente desde el servicio
        console.log(this.authService.isLoggedIn().subscribe()); // Verifica que el estado de autenticación se está obteniendo correctamente desde el servicio
        console.log(this.authService.getLoggedUser()); // Verifica que el token se está obteniendo correctamente desde el servicio

      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
