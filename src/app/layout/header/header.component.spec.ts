import { TestBed } from '@angular/core/testing';

import { LayoutService } from '../../core/services/layout.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
    }).compileComponents();
  });

  it('opens the mobile menu when the menu button is pressed', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const states: boolean[] = [];
    const subscription = TestBed.inject(LayoutService).mobileMenuOpen$.subscribe(open =>
      states.push(open)
    );

    fixture.nativeElement.querySelector('.menu-button').click();

    expect(states).toEqual([false, true]);
    subscription.unsubscribe();
  });
});
