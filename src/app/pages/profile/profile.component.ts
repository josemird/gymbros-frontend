import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  form = this.fb.group({
    photo: [''],
    name: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    gym: [''],
    age: [''],
    favorite_exercises: [''],
    goals: [''],
    hobbies: ['']
  });

  editingField: string | null = null;
  showPasswordChange = false;
  newPassword = '';
  confirmPassword = '';
  error: string | null = null;

  ngOnInit(): void {
    const user = this.userService.getCurrentUser();
    if (user) {
      this.form.patchValue(user);
    }
  }

  onEdit(field: string): void {
    if (this.editingField === field) {
      const value = this.form.get(field)?.value;
      this.userService.updateCurrentUser({ [field]: value }).subscribe({
        next: () => this.editingField = null
      });
    } else {
      this.editingField = field;
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.form.get('photo')?.setValue(base64);
      this.userService.updateCurrentUser({ photo: base64 }).subscribe();
    };
    reader.readAsDataURL(file);
  }
}
