import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

const DURATION_MS: Record<ToastType, number> = {
  success: 5000,
  error: 8000,
};

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastsSubject = new BehaviorSubject<Toast[]>([]);
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
  private nextId = 1;

  readonly toasts$ = this.toastsSubject.asObservable();

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message);
  }

  dismiss(id: number): void {
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
    this.toastsSubject.next(this.toastsSubject.value.filter(toast => toast.id !== id));
  }

  private show(type: ToastType, message: string): void {
    const toast: Toast = { id: this.nextId++, type, message };

    this.toastsSubject.next([...this.toastsSubject.value, toast]);
    this.timers.set(
      toast.id,
      setTimeout(() => this.dismiss(toast.id), DURATION_MS[type])
    );
  }
}
