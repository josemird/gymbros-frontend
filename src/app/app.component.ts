import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { UserService } from './services/user/user.service';
import { AuthService } from './services/auth/auth.service';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';

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

  @ViewChild('pageContainer', { static: true }) pageContainer!: ElementRef<HTMLElement>;


  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      this.userService.fetchCurrentUser();
    }
  }

    onActivate() {
    const el = this.pageContainer.nativeElement;
    el.classList.add('fade-in');
    el.addEventListener(
      'animationend',
      () => el.classList.remove('fade-in'),
      { once: true }
    );
  }

}
