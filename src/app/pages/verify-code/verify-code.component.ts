import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-reset-verify-code',
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
  email = '';

  ngOnInit() {
    const storedEmail = localStorage.getItem('resetEmail');
    const storedMode = localStorage.getItem('verifyType');

    if (!storedEmail || !storedMode) return;

    this.email = storedEmail;
    this.mode = storedMode as 'password_reset' | 'register';

    if (this.mode === 'password_reset') {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const data = {
      email: this.email,
      code: this.form.value.code ?? '',
      password: this.form.value.password ?? '',
      type: this.mode
    };

    this.auth.verifyCodeAndResetPassword(data).subscribe({
      next: () => {
        localStorage.removeItem('resetEmail');
        localStorage.removeItem('verifyType');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.error = this.mode === 'password_reset'
          ? 'Código inválido o error en la contraseña'
          : 'Código inválido';
      }
    });
  }
}
