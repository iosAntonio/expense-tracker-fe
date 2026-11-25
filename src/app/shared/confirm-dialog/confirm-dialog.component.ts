import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { openModal } from '../dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent implements AfterViewInit {
  @Input() title = '';
  @Input() message = '';
  @Input() confirmLabel = 'Conferma';
  @Input() busy = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() dismissed = new EventEmitter<void>();

  @ViewChild('dialog') private dialog?: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    openModal(this.dialog?.nativeElement);
  }

  onCancel(event: Event): void {
    event.preventDefault();
    this.dismiss();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog?.nativeElement) {
      this.dismiss();
    }
  }

  dismiss(): void {
    if (!this.busy) {
      this.dismissed.emit();
    }
  }
}
