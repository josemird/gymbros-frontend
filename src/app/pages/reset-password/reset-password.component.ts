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

    this.auth.sendRecoveryCode(this.form.value.email!).subscribe({
      next: () => {
        localStorage.setItem('resetEmail', this.form.value.email ?? '');
        this.router.navigate(['/verify-code']);
      },
      error: () => {
        this.message = 'Error al enviar el código';
      }
    });
  }
}
