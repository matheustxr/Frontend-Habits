import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { Observable } from 'rxjs';

import { HabitFormComponent } from '../../_components/habit-form/habit-form.component';
import { ManagedItem } from '../../interfaces/managed-item.model';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../interfaces/category.model';
import { ManagedItemComponent } from '../../_components/managed-item/managed-item.component';
import { Habit } from '../../interfaces/habit.model';
import { HabitService } from '../../services/habit.service';
import { SidebarComponent } from '../../_components/sidebar/sidebar.component';

@Component({
  selector: 'app-management-page',
  imports: [
    CommonModule,
    DialogModule,
    ManagedItemComponent,
    HabitFormComponent,
    SidebarComponent
  ],
  templateUrl: './management-page.component.html',
})
export class ManagementPageComponent implements OnInit {
  type!: 'habits' | 'categories';
  title: string = '';
  items: ManagedItem[] = [];
  displayModal = false;
  itemToEdit: any | null = null;

  constructor(
    private route: ActivatedRoute,
    private habitsService: HabitService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const typeParam = params.get('type');
      if (typeParam === 'habits' || typeParam === 'categories') {
        this.type = typeParam;
        this.title = this.type === 'habits' ? 'Meus Hábitos' : 'Minhas Categorias';
        this.loadData();
      }
    });
  }

  loadData(): void {
    let service$: Observable<any[]>;

    if (this.type === 'habits') {
      service$ = this.habitsService.getAllHabits();
    } else {
      service$ = this.categoriesService.getAllCategories();
    }

    service$.subscribe(data => {
      console.log(data);
      this.items = data.map(item => ({
        id: item.id!,
        name: item.title || item.category
      }));
    });
  }

  handleAddItem(): void {
    this.itemToEdit = null;
    this.displayModal = true;
  }

  handleEditItem(item: ManagedItem): void {
    if (this.type === 'habits') {
      this.habitsService.getHabitById(item.id).subscribe((itemDetails: Habit) => {
        this.itemToEdit = itemDetails;
        this.displayModal = true;
      });
    } else {
      this.categoriesService.getCategoryById(item.id).subscribe((itemDetails: Category) => {
        this.itemToEdit = itemDetails;
        this.displayModal = true;
      });
    }
  }

  handleDeleteItem(item: ManagedItem): void {
    if (confirm(`Tem certeza que deseja excluir "${item.name}"?`)) {

      let delete$: Observable<void>;

      if (this.type === 'habits') {
        delete$ = this.habitsService.deleteHabit(item.id);
      } else {
        delete$ = this.categoriesService.deleteCategory(item.id);
      }

      delete$.subscribe(() => {
        this.loadData();
      });
    }
  }

  onItemSaved(): void {
    this.displayModal = false;
    this.loadData();
  }
}
