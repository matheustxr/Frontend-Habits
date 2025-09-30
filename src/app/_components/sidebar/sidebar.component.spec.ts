import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct number of navigation links', () => {
    const linkElements = fixture.debugElement.queryAll(By.css('nav a'));

    expect(linkElements.length).toBe(component.mainNavLinks.length);
  });

  it('should display the correct label for each link', () => {
    const linkElements = fixture.debugElement.queryAll(By.css('nav a'));
    const expectedLabels = component.mainNavLinks.map(link => link.label);

    linkElements.forEach((linkElement, index) => {
      const span = linkElement.query(By.css('span'));
      expect(span.nativeElement.textContent.trim()).toBe(expectedLabels[index]);
    });
  });

  it('should have the correct icon class for each link', () => {
    const linkElements = fixture.debugElement.queryAll(By.css('nav a'));
    const expectedIconClasses = component.mainNavLinks.map(link => link.icon);

    linkElements.forEach((linkElement, index) => {
      const icon = linkElement.query(By.css('i'));
      expect(icon.nativeElement.className).toContain(expectedIconClasses[index]);
    });
  });

  it('should have the correct href attribute for each link', () => {
    const linkElements = fixture.debugElement.queryAll(By.css('nav a'));
    const expectedRouterLinks = component.mainNavLinks.map(link => link.routerLink);

    linkElements.forEach((linkDe, index) => {
      const href = linkDe.nativeElement.getAttribute('href');
      expect(href).toBe(expectedRouterLinks[index]);
    });
  });
});
