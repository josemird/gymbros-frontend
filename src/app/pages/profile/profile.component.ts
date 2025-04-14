import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  user: any = null;
  editing: { [key: string]: boolean } = {};

  form = this.fb.group({
    name: [''],
    username: [''],
    email: [''],
    photo: [''],
    gym: [''],
    age: [''],
    favorite_exercises: [''],
    goals: [''],
    hobbies: ['']
  });

  newPassword = '';
  confirmPassword = '';

  ngOnInit(): void {
    this.userService.fetchCurrentUser();
    this.userService.watchCurrentUser$().subscribe(user => {
      if (user) {
        this.user = user;
        this.form.patchValue(user);
      }
    });
  }

  toggleEdit(field: string): void {
    if (this.editing[field]) {
      const value = this.form.get(field)?.value;
      this.userService.updateCurrentUser({ [field]: value }).subscribe(() => {
        this.editing[field] = false;
      });
    } else {
      this.editing[field] = true;
    }
  }

  handleImageUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.form.get('photo')?.setValue(base64);
        this.userService.updateCurrentUser({ photo: base64 }).subscribe();
      };
      reader.readAsDataURL(file);
    }
  }

  changePassword(): void {
    if (this.newPassword && this.newPassword === this.confirmPassword) {
      this.userService.changePassword(this.newPassword).subscribe(() => {
        this.newPassword = '';
        this.confirmPassword = '';
      });
    }
  }

  deleteAccount(): void {
    const confirmed = confirm('¿Estás seguro de que quieres eliminar tu cuenta?');
    if (confirmed) {
      this.userService.deleteCurrentUser().subscribe(() => {
        window.location.href = '/login';
      });
    }
  }
}
