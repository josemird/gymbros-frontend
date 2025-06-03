import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

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

  form = this.fb.group({
    name: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  error: string | null = null;
  message: string = '';

  onSubmit() {
    if (this.form.invalid) return;

    const data = this.form.value;
    this.auth.sendRegisterCode(data.email!).subscribe({
      next: () => {
        this.message = 'Código enviado al correo';
        localStorage.setItem('verifyEmail', data.email ?? '');
        localStorage.setItem('pendingRegistration', JSON.stringify(data));
        setTimeout(() => {
          this.router.navigate(['/verify-code'], { queryParams: { mode: 'register' } });
        }, 1500);
      },
      error: () => this.error = 'Error al enviar el código'
    });
  }
}
