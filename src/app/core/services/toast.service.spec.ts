import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { Toast, ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;
  let current: Toast[] = [];

  beforeEach(() => {
    service = TestBed.inject(ToastService);
    service.toasts$.subscribe(toasts => (current = toasts));
  });

  it('shows success and error toasts in the order they arrive', fakeAsync(() => {
    service.success('Import completato');
    service.error('Import non riuscito');

    expect(current.map(toast => [toast.type, toast.message])).toEqual([
      ['success', 'Import completato'],
      ['error', 'Import non riuscito'],
    ]);
    tick(8000);
  }));

  it('hides a success toast after 5 seconds and an error after 8', fakeAsync(() => {
    service.success('Import completato');
    service.error('Import non riuscito');

    tick(5000);
    expect(current.map(toast => toast.message)).toEqual(['Import non riuscito']);

    tick(3000);
    expect(current).toEqual([]);
  }));

  it('can be dismissed before it expires', fakeAsync(() => {
    service.error('Import non riuscito');

    service.dismiss(current[0].id);

    expect(current).toEqual([]);
    tick(8000);
    expect(current).toEqual([]);
  }));
});
