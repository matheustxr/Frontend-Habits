import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagedItemComponent } from './managed-item.component';
import { ManagedItem } from '../../interfaces/managed-item.model';

describe('ManagedItemComponent', () => {
  let component: ManagedItemComponent;
  let fixture: ComponentFixture<ManagedItemComponent>;

  const mockItem: ManagedItem = { id: 1, name: 'Testar a aplicação' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagedItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagedItemComponent);
    component = fixture.componentInstance;

    component.item = mockItem;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the item name correctly', () => {
    const element = fixture.nativeElement as HTMLElement;

    const spanElement = element.querySelector('span');

    expect(spanElement?.textContent).toContain(mockItem.name);
  });

  it('should emit the edit event with the correct item when the edit button is clicked', () => {
    spyOn(component.edit, 'emit');

    const editButton = fixture.nativeElement.querySelector('button[aria-label="Editar"]');

    editButton.click();

    expect(component.edit.emit).toHaveBeenCalledOnceWith(mockItem);
  });

  it('should emit the delete event with the correct item when the delete button is clicked', () => {
    spyOn(component.delete, 'emit');

    const deleteButton = fixture.nativeElement.querySelector('button[aria-label="Excluir"]');

    deleteButton.click();

    expect(component.delete.emit).toHaveBeenCalledOnceWith(mockItem);
  });
});
