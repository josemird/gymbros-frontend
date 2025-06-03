import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  message: string = '';

    onSubmit() {
    if (this.form.invalid) return;

    const data = {
      email: this.form.value.email,
      type: 'password_reset'
    };

    this.http.post('/api/send-code', data).subscribe({
      next: () => {
        localStorage.setItem('resetEmail', this.form.value.email ?? '');
        this.router.navigate(['/reset-verify-code']);
      },
      error: () => {
        this.message = 'Error al enviar el código';
      }
    });
  }

}
