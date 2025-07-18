//Descripción: Componente para verificar el código de restablecimiento de contraseña o registro de usuario, José Miguel Ramírez Domínguez.

import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.scss'
})
export class ResetVerifyCodeComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    code: ['', Validators.required],
    password: ['']
  });

  mode: 'password_reset' | 'register' = 'password_reset';
  error: string = '';
  email = localStorage.getItem('resetEmail') || '';

  ngOnInit() {
    const storedEmail = localStorage.getItem('resetEmail');
    const storedMode = localStorage.getItem('verifyType');

    if (!storedEmail || !storedMode) {
      this.error = 'Datos faltantes. Inténtalo de nuevo.';
      return;
    }

    this.email = storedEmail;
    this.mode = storedMode as 'password_reset' | 'register';

    if (this.mode === 'password_reset') {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    if (this.mode === 'password_reset') {
      const data = {
        email: this.email,
        code: this.form.value.code ?? '',
        password: this.form.value.password ?? '',
        type: 'password_reset'
      };

      this.auth.verifyCode(data).subscribe({
        next: () => {
          localStorage.removeItem('resetEmail');
          localStorage.removeItem('verifyType');
          this.router.navigate(['/login']);
        },
        error: () => {
          this.error = 'Código inválido o error en la contraseña';
        }
      });

    } else if (this.mode === 'register') {
      const registerData = localStorage.getItem('pendingRegister');
      if (!registerData) {
        this.error = 'Datos de registro no encontrados';
        return;
      }

      const data = JSON.parse(registerData);
      this.auth.register(data).subscribe({
        next: () => {
          localStorage.removeItem('pendingRegister');
          localStorage.removeItem('resetEmail');
          localStorage.removeItem('verifyType');
          this.router.navigate(['/login']);
        },
        error: () => {
          this.error = 'Error al completar el registro';
        }
      });
    }
  }
}
