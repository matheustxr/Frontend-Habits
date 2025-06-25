import {
  Component,
  ElementRef,
  HostListener,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popover',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popover.component.html',
})
export class PopoverComponent implements AfterViewInit {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  @ViewChild('triggerWrapper') triggerWrapper!: ElementRef;
  @ViewChild('popoverContent') popoverContent!: ElementRef;

  renderAbove = false;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.updatePosition();
    });
  }

  toggle() {
    this.open = !this.open;
    this.openChange.emit(this.open);

    if (this.open) {
      setTimeout(() => this.updatePosition(), 50); // atrasar um pouco mais para o conteúdo renderizar
    }
  }

  close() {
    this.open = false;
    this.openChange.emit(this.open);
  }

  updatePosition() {
    const triggerRect = this.triggerWrapper.nativeElement.getBoundingClientRect();
    const popoverHeight = this.popoverContent.nativeElement.offsetHeight;

    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    this.renderAbove = popoverHeight > spaceBelow && spaceAbove > popoverHeight;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!this.el.nativeElement.contains(target)) {
      this.close();
    }
  }
}
