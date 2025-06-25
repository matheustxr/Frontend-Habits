import {
  Component,
  Input,
  ElementRef,
  HostListener,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { HabitsListComponent } from '../habits-list/habits-list.component';
import dayjs from 'dayjs';

@Component({
  selector: 'app-habit-day',
  imports: [CommonModule, ButtonModule, ProgressBarComponent, HabitsListComponent],
  templateUrl: './habit-day.component.html',
})
export class HabitDayComponent implements AfterViewInit, OnChanges {
  @Input() date!: Date;
  @Input() defaultCompleted = 0;
  @Input() amount = 0;

  @ViewChild('triggerWrapper') triggerWrapper!: ElementRef;
  @ViewChild('popoverContent') popoverContent!: ElementRef;

  isPopoverOpen = false;
  renderAbove = false;
  completed = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['defaultCompleted']) {
      this.completed = changes['defaultCompleted'].currentValue;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.updatePosition(), 50);
  }

  toggle(): void {
    this.isPopoverOpen = !this.isPopoverOpen;
    if (this.isPopoverOpen) {
      setTimeout(() => this.updatePosition(), 50);
    }
  }

  close(): void {
    this.isPopoverOpen = false;
  }

  updatePosition(): void {
    const triggerRect = this.triggerWrapper.nativeElement.getBoundingClientRect();
    const popoverHeight = this.popoverContent?.nativeElement?.offsetHeight || 0;

    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    this.renderAbove = popoverHeight > spaceBelow && spaceAbove > popoverHeight;
  }

  handleCompletedChanged(value: number): void {
    console.log('mudando o valor dessa caralha')
    this.completed = value;
  }

  get completedPercentage(): number {
    return this.amount > 0
      ? Math.round((this.completed / this.amount) * 100)
      : 0;
  }

  get dayOfWeek(): string {
    return dayjs(this.date).format('dddd');
  }

  get dayAndMonth(): string {
    return dayjs(this.date).format('DD/MM');
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!this.triggerWrapper.nativeElement.contains(target) &&
        !this.popoverContent?.nativeElement?.contains(target)) {
      this.close();
    }
  }
}
