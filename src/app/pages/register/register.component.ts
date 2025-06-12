//Descripción: Componente de registro que permite a los usuarios crear una cuenta nueva, validando la disponibilidad del nombre, nombre de usuario y el correo electrónico y contraseña, José Miguel Ramírez Domínguez.

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private userService = inject(UserService);

  form = this.fb.group({
    name: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  error: string | null = null;

  users: { username: string, email: string }[] = [];
  usernameExists: boolean = false;
  emailExists: boolean = false;

  constructor() {
    this.userService.getAllUsernamesAndEmails().subscribe(users => {
      this.users = users;
    });

    this.form.controls['username'].valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(username => {
        this.usernameExists = !!this.users.find(u => u.username === username);
      });

    this.form.controls['email'].valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(email => {
        this.emailExists = !!this.users.find(u => u.email === email);
      });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const data = this.form.value;
    localStorage.setItem('pendingRegister', JSON.stringify(data));
    localStorage.setItem('resetEmail', data.email ?? '');
    localStorage.setItem('verifyType', 'register');

    this.auth.sendCode({ email: data.email as string, type: 'register' }).subscribe({
      next: () => this.router.navigate(['/verify-code']),
      error: (err) => {
        if (err.status === 422 && err.error?.errors) {
          const fieldErrors = err.error.errors;
          if (fieldErrors.name) {
            this.error = `Nombre: ${fieldErrors.name[0]}`;
          } else if (fieldErrors.username) {
            this.error = `Nombre de usuario: ${fieldErrors.username[0]}`;
          } else if (fieldErrors.email) {
            this.error = `Email: ${fieldErrors.email[0]}`;
          } else if (fieldErrors.password) {
            this.error = `Contraseña: ${fieldErrors.password[0]}`;
          } else {
            this.error = 'Error de validación.';
          }
        } else {
          this.error = 'Error al enviar código de verificación';
        }
      }
    });
  }
}
