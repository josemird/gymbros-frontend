import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-verify-code',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.scss'
})
export class ResetVerifyCodeComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  form = this.fb.group({
    code: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password_confirmation: ['', Validators.required]
  });

  error: string = '';

  onSubmit() {
    const email = localStorage.getItem('resetEmail');
    if (!email || this.form.invalid) return;

    const payload = {
      email,
      code: this.form.value.code,
      password: this.form.value.password,
      password_confirmation: this.form.value.password_confirmation,
      type: 'password_reset'
    };

    this.http.post('/api/verify-code', payload).subscribe({
      next: () => {
        localStorage.removeItem('resetEmail');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.error = 'Código o contraseña inválidos';
      }
    });
  }
}
