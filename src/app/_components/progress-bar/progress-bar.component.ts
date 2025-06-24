import { Component, Input  } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  imports: [],
  templateUrl: './progress-bar.component.html',
  styles: ``
})
export class ProgressBarComponent {
  @Input() progress: number = 0; 
}
