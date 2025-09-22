import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  navLinks = [
    { label: 'Dashboard', icon: 'pi pi-th-large', routerLink: '/dashboard' },
    { label: 'Meus Hábitos', icon: 'pi pi-clone', routerLink: '/manage/habits' },
    { label: 'Categorias', icon: 'pi pi-tags', routerLink: '/manage/categories' },
  ];
}
