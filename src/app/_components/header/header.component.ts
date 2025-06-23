import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  imports: [DialogModule, ButtonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  displayModal = false;

  showModal() {
    this.displayModal = true;
  }
}
