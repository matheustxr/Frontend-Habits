import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ManagedItem } from '../../interfaces/managed-item.model';

@Component({
  selector: 'app-managed-item',
  imports: [CommonModule],
  templateUrl: './managed-item.component.html',
})
export class ManagedItemComponent {
  @Input({ required: true }) item!: ManagedItem;
  @Output() edit = new EventEmitter<ManagedItem>();
  @Output() delete = new EventEmitter<ManagedItem>();
}
