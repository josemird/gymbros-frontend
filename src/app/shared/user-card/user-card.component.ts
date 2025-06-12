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

  backendUrl = 'https://vps-ff89e3e0.vps.ovh.net/uploads/';
  defaultAvatar = '/SVG_AVATAR_FONDO_NEGRO.svg';

  private router = inject(Router);

  goToChat() {
    this.router.navigate(['/messages', this.user.id]);
  }
}
