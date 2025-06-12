//Descripción: Componente de restablecimiento de contraseña que permite a los usuarios solicitar un código para restablecer su contraseña, José Miguel Ramírez Domínguez.

import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  message: string = '';

  onSubmit() {
    if (this.form.invalid) return;

    const email = this.form.get('email')?.value?.trim();
    if (!email) return;

    const data = { email, type: 'password_reset' as const };

    localStorage.setItem('resetEmail', email);
    localStorage.setItem('verifyType', 'password_reset');

    this.auth.sendCode(data).subscribe({
      next: () => this.router.navigate(['/verify-code']),
      error: () => this.message = 'Error al enviar el código'
    });
  }

}
