//Descripción: Componente de tarjeta de usuario o "cards" que muestra información básica del usuario y permite navegar al chat o guardarlos, José Miguel Ramírez Domínguez.

import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {
  @Input() user!: any;
  @Input() onLike?: () => void;

  backendUrl = 'https://gymbros-backend.up.railway.app/uploads/';
  defaultAvatar = '/SVG_AVATAR_FONDO_NEGRO.svg';

  private router = inject(Router);

  goToChat() {
    this.router.navigate(['/messages', this.user.id]);
  }
}
