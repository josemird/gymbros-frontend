import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    name: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    photo: [''],
    gym: [''],
    age: [''],
    favorite_exercises: [''],
    goals: [''],
    hobbies: ['']
  });

  loading = true;
  error: string | null = null;
  success: string | null = null;

  ngOnInit() {
    this.userService.fetchCurrentUser();
    this.userService.watchCurrentUser$().subscribe(user => {
      if (user) {
        this.form.patchValue(user);
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.userService.updateCurrentUser(this.form.value).subscribe({
      next: () => this.success = 'Perfil actualizado con éxito',
      error: () => this.error = 'Error al actualizar el perfil'
    });
  }

  onChangePassword() {
    const newPassword = prompt('Introduce la nueva contraseña (mínimo 6 caracteres)');
    if (newPassword && newPassword.length >= 6) {
      this.userService.changePassword(newPassword).subscribe({
        next: () => alert('Contraseña actualizada'),
        error: () => alert('Error al cambiar la contraseña')
      });
    }
  }

  onDeleteAccount() {
    if (confirm('¿Seguro que quieres eliminar tu cuenta? Esta acción es irreversible.')) {
      this.userService.deleteCurrentUser().subscribe({
        next: () => {
          this.authService.logout().subscribe(() => {
            this.router.navigate(['/register']);
          });
        },
        error: () => alert('Error al eliminar la cuenta')
      });
    }
  }
}
