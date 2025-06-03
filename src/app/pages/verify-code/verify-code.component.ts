import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.scss'
})
export class VerifyCodeComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.group({
    code: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password_confirmation: ['', Validators.required]
  });

  error: string = '';
  mode: 'reset' | 'register' = 'reset';

  ngOnInit() {
    const query = this.route.snapshot.queryParamMap;
    const paramMode = query.get('mode');
    if (paramMode === 'register') this.mode = 'register';
  }

  onSubmit() {
    const email = localStorage.getItem('verifyEmail');
    if (!email || this.form.invalid) return;

    const data = {
      email,
      code: this.form.value.code,
      password: this.form.value.password,
      password_confirmation: this.form.value.password_confirmation,
      type: this.mode === 'reset' ? 'password_reset' : 'registration'
    };

    this.http.post('https://vps-ff89e3e0.vps.ovh.net/api/verify-code', data).subscribe({
      next: () => {
        localStorage.removeItem('verifyEmail');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.error = 'Código o contraseña inválidos';
      }
    });
  }
}
