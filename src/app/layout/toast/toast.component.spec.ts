import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ToastService } from '../../core/services/toast.service';
import { ToastComponent } from './toast.component';

describe('ToastComponent', () => {
  let fixture: ComponentFixture<ToastComponent>;
  let service: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToastComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    service = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  function toasts(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.toast'));
  }

  it('shows each toast with its message and an accessible role', fakeAsync(() => {
    service.success('Import completato');
    service.error('Import non riuscito');
    fixture.detectChanges();

    expect(toasts().length).toBe(2);
    expect(toasts()[0].classList).toContain('toast-success');
    expect(toasts()[0].getAttribute('role')).toBe('status');
    expect(toasts()[0].textContent).toContain('Import completato');
    expect(toasts()[1].classList).toContain('toast-error');
    expect(toasts()[1].getAttribute('role')).toBe('alert');
    tick(8000);
  }));

  it('closes a toast with its close button', fakeAsync(() => {
    service.error('Import non riuscito');
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('.toast-close') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(toasts().length).toBe(0);
  }));
});
