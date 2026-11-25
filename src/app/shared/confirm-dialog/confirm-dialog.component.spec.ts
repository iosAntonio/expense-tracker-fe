import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let component: ConfirmDialogComponent;
  let dialog: HTMLElement & { open: boolean };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    component.title = 'Eliminare tutto il mese?';
    component.message = 'Verranno eliminate 2 spese di ottobre 2026.';
    component.confirmLabel = 'Elimina il mese';
    fixture.detectChanges();
    dialog = fixture.nativeElement.querySelector('dialog');
  });

  it('opens as a modal showing the question', () => {
    expect(dialog.open).toBeTrue();
    expect(dialog.textContent).toContain('Eliminare tutto il mese?');
    expect(dialog.textContent).toContain('Verranno eliminate 2 spese di ottobre 2026.');
    expect(dialog.querySelector('.button-danger')?.textContent).toContain('Elimina il mese');
  });

  it('emits confirmed or dismissed from its buttons', () => {
    const confirmed = jasmine.createSpy('confirmed');
    const dismissed = jasmine.createSpy('dismissed');
    component.confirmed.subscribe(confirmed);
    component.dismissed.subscribe(dismissed);

    (dialog.querySelector('.button-danger') as HTMLButtonElement).click();
    (dialog.querySelector('.button:not(.button-danger)') as HTMLButtonElement).click();

    expect(confirmed).toHaveBeenCalledTimes(1);
    expect(dismissed).toHaveBeenCalledTimes(1);
  });

  it('treats Escape as a dismissal, except while busy', () => {
    const dismissed = jasmine.createSpy('dismissed');
    component.dismissed.subscribe(dismissed);

    const escape = new Event('cancel', { cancelable: true });
    dialog.dispatchEvent(escape);
    expect(escape.defaultPrevented).toBeTrue();
    expect(dismissed).toHaveBeenCalledTimes(1);

    component.busy = true;
    fixture.detectChanges();
    dialog.dispatchEvent(new Event('cancel', { cancelable: true }));

    expect(dismissed).toHaveBeenCalledTimes(1);
    expect(dialog.querySelector('.button-danger')?.textContent).toContain('Eliminazione…');
  });
});
