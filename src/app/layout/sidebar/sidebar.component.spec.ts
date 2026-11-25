import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LayoutService } from '../../core/services/layout.service';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let fixture: ComponentFixture<SidebarComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  function sidebar(): HTMLElement {
    return element.querySelector('aside') as HTMLElement;
  }

  it('links to the dashboard, the expenses and the import pages', () => {
    const links = Array.from(element.querySelectorAll('a.nav-item'));

    expect(links.map(link => link.getAttribute('href'))).toEqual([
      '/dashboard',
      '/expenses',
      '/import',
    ]);
    expect(links.map(link => link.querySelector('.nav-label')?.textContent?.trim())).toEqual([
      'Dashboard',
      'Spese',
      'Import',
    ]);
  });

  it('collapses and expands the menu', () => {
    const button = element.querySelector('.collapse-button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();
    expect(sidebar().classList).toContain('collapsed');
    expect(button.getAttribute('aria-label')).toBe('Espandi menu');

    button.click();
    fixture.detectChanges();
    expect(sidebar().classList).not.toContain('collapsed');
  });

  it('closes the mobile menu from the backdrop', () => {
    TestBed.inject(LayoutService).toggleMobileMenu();
    fixture.detectChanges();
    expect(sidebar().classList).toContain('mobile-open');

    (element.querySelector('.sidebar-backdrop') as HTMLElement).click();
    fixture.detectChanges();

    expect(sidebar().classList).not.toContain('mobile-open');
    expect(element.querySelector('.sidebar-backdrop')).toBeNull();
  });
});
