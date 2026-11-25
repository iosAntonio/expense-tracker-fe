import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { ToastComponent } from './layout/toast/toast.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent, HeaderComponent, SidebarComponent, ToastComponent],
    }).compileComponents();
  });

  it('renders the navigation, the header, the routed page area and the toasts', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('app-sidebar .sidebar-nav')).not.toBeNull();
    expect(element.querySelector('app-header .header-title')?.textContent).toContain(
      'Expense Tracker'
    );
    expect(element.querySelector('main.main-content router-outlet')).not.toBeNull();
    expect(element.querySelector('app-toast .toast-container')).not.toBeNull();
  });
});
