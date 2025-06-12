//Descripción: Componente de perfil que permite a los usuarios ver y editar su información personal, subir una foto de perfil, cambiar su contraseña y eliminar su cuenta, José Miguel Ramírez Domínguez.

import { Component, inject, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GymService } from '../../services/gym/gym.service';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private gymService = inject(GymService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private renderer = inject(Renderer2);

  form = this.fb.group({
    photo: [''],
    name: [{ value: '', disabled: true }, Validators.required],
    username: [{ value: '', disabled: true }, Validators.required],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    gym_id: [{ value: '', disabled: true }],
    age: [{ value: '', disabled: true }],
    favorite_exercises: [{ value: '', disabled: true }],
    goals: [{ value: '', disabled: true }],
    hobbies: [{ value: '', disabled: true }]
  });

  gyms: any[] = [];
  editingField: string | null = null;
  showPasswordChange = false;
  newPassword = '';
  confirmPassword = '';
  error: string | null = null;
  private clickListener: (() => void) | null = null;

  ngOnInit(): void {
    this.gymService.getGyms().subscribe({
      next: (res) => {
        this.gyms = res.gyms;
      }
    });

    const user = this.userService.getCurrentUser();
    if (user) {
      this.form.patchValue(user);
    } else {
      const token = this.authService.getToken();
      if (token) {
        this.userService.fetchCurrentUser();
        this.userService.watchCurrentUser$().subscribe(user => {
          if (user) {
            this.form.patchValue(user);
          }
        });
      }
    }

    this.clickListener = this.renderer.listen('document', 'click', (event: Event) => {
      if (this.error) {
        const path = event.composedPath ? event.composedPath() : (event as any).path || [];
        if (!path.some((el: any) => el?.classList?.contains?.('image-upload'))) {
          this.error = null;
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.clickListener) this.clickListener();
  }

  onEdit(field: string): void {
    const control = this.form.get(field);
    if (this.editingField === field) {
      const value = control?.value;
      this.userService.updateCurrentUser({ [field]: value }).subscribe({
        next: () => {
          this.editingField = null;
          control?.disable();
        }
      });
    } else {
      if (this.editingField) {
        this.form.get(this.editingField)?.disable();
      }
      this.editingField = field;
      control?.enable();
    }
  }

  onDelete(): void {
    const confirmed = confirm('¿Estás seguro de que quieres eliminar tu cuenta?');
    if (confirmed) {
      this.userService.deleteCurrentUser().subscribe(() => {
        localStorage.clear();
        this.router.navigate(['/login']);
      });
    }
  }

  onPasswordChange(): void {
    if (!this.newPassword || this.newPassword !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }
    this.userService.changePassword(this.newPassword).subscribe({
      next: () => {
        this.showPasswordChange = false;
        this.newPassword = '';
        this.confirmPassword = '';
        this.error = null;
      }
    });
  }


  onPhotoClick(event: Event): void {
    event.stopPropagation();
  }

  onPhotoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.error = null;
    this.userService.uploadPhoto(file).subscribe({
      next: res => {
        this.form.get('photo')?.setValue(res.photo);
        this.userService.fetchCurrentUser();
        location.reload();
      },
      error: err => {
        if (file.size > 6 * 1024 * 1024) {
          this.error = 'La foto es demasiado grande, máximo 6MB';
        } else if (err?.error?.message) {
          this.error = err.error.message;
        } else {
          this.error = 'Error al subir la foto. Inténtalo de nuevo.';
        }
      }
    });
  }

  fieldLabels: { [key: string]: string } = {
    name: 'Nombre',
    username: 'Usuario',
    email: 'Correo electrónico',
    age: 'Edad',
    favorite_exercises: 'Ejercicios favoritos',
    goals: 'Objetivos',
    hobbies: 'Hobbies'
  };
}
