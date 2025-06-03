import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  private route = inject(ActivatedRoute);

  form = this.fb.group({
    code: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  error: string = '';
  type: 'password_reset' | 'register' = 'password_reset';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['type'] === 'register') {
        this.type = 'register';
      }
    });
  }

  onSubmit() {
    const email = localStorage.getItem('resetEmail');
    if (!email || this.form.invalid) return;

    const data = {
      email,
      code: this.form.value.code ?? '',
      password: this.form.value.password ?? '',
      type: this.type
    };

    this.auth.verifyCodeAndResetPassword(data).subscribe({
      next: () => {
        localStorage.removeItem('resetEmail');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.error = 'Código inválido o error en la contraseña';
      }
    });
  }
}
