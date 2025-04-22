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
  defaultAvatar = 'https://pentaxcenter.com/wp-content/uploads/no-user-image-square.jpg';

  private router = inject(Router);

  goToChat() {
    this.router.navigate(['/messages', this.user.id]);
  }
}
