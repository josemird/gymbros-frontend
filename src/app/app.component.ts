import { Component, inject, OnInit } from '@angular/core';
import { UserService } from './services/user/user.service';
import { AuthService } from './services/auth/auth.service';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Gymbros';
  private userService = inject(UserService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      this.userService.fetchCurrentUser();
    }
  }
}
