import {
  Component, Input, ElementRef, HostListener, ViewChild,
  OnChanges, SimpleChanges, EventEmitter, Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { HabitsListComponent } from '../habits-list/habits-list.component';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

@Component({
  selector: 'app-habit-day',
  imports: [CommonModule, ProgressBarComponent, HabitsListComponent],
  templateUrl: './habit-day.component.html',
})
export class HabitDayComponent implements OnChanges {
  @Input() date!: Date;
  @Input() defaultCompleted = 0;
  @Input() amount = 0;

  @Output() editHabit = new EventEmitter<any>();
  onEditHabit(habit: any): void {
    this.editHabit.emit(habit);
    this.close();
  }

  @ViewChild('triggerWrapper') triggerWrapper!: ElementRef;
  @ViewChild('popoverContent') popoverContent!: ElementRef;

  isPopoverOpen = false;
  renderAbove = false;
  popoverStyle: { [key: string]: string } = {};

  completed = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['defaultCompleted']) {
      this.completed = this.defaultCompleted;
    }
  }

  toggle(): void {
    this.isPopoverOpen = !this.isPopoverOpen;
    if (this.isPopoverOpen) {
      setTimeout(() => this.updatePosition(), 0);
    }
  }

  close(): void {
    this.isPopoverOpen = false;
  }

  updatePosition(): void {
    if (!this.triggerWrapper?.nativeElement || !this.popoverContent?.nativeElement) return;

    const triggerRect = this.triggerWrapper.nativeElement.getBoundingClientRect();
    const popoverRect = this.popoverContent.nativeElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - triggerRect.bottom;
    this.renderAbove = popoverRect.height + 12 > spaceBelow && triggerRect.top > popoverRect.height;

    const top = this.renderAbove
      ? triggerRect.top - popoverRect.height - 12
      : triggerRect.bottom + 12;

    const idealLeft = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2);
    const left = Math.max(8, Math.min(idealLeft, viewportWidth - popoverRect.width - 8));

    const arrowLeft = triggerRect.left + (triggerRect.width / 2) - left;

    this.popoverStyle = {
      'top': `${top}px`,
      'left': `${left}px`,
      '--arrow-left-position': `${arrowLeft}px`
    };
  }

  handleCompletedChanged(value: number): void {
    this.completed = value;
  }

  get completedPercentage(): number {
    return this.amount > 0 ? Math.round((this.completed / this.amount) * 100) : 0;
  }

  get dayOfWeek(): string {
    return dayjs(this.date).format('dddd');
  }

  get dayAndMonth(): string {
    return dayjs(this.date).format('DD/MM');
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.isPopoverOpen) return;
    const target = event.target as HTMLElement;
    const isClickInside = this.triggerWrapper.nativeElement.contains(target) ||
                          this.popoverContent?.nativeElement?.contains(target);
    if (!isClickInside) {
      this.close();
    }
  }

  @HostListener('window:resize')
  @HostListener('document:scroll')
  onScrollOrResize(): void {
    if (this.isPopoverOpen) {
      this.updatePosition();
    }
  }
}
