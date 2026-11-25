import { Component } from '@angular/core';

import { Toast, ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  readonly toasts$ = this.toastService.toasts$;

  constructor(private toastService: ToastService) {}

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }

  trackToast(_index: number, toast: Toast): number {
    return toast.id;
  }
}
