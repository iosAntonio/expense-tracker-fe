import { Component, EventEmitter, Input, Output } from '@angular/core';

const MONTHS = Array.from({ length: 12 }, (_, index) => {
  const name = new Intl.DateTimeFormat('it-IT', { month: 'long' }).format(new Date(2000, index, 1));

  return { value: index + 1, label: name.charAt(0).toUpperCase() + name.slice(1) };
});

@Component({
  selector: 'app-period-selector',
  templateUrl: './period-selector.component.html',
  styleUrls: ['./period-selector.component.scss'],
})
export class PeriodSelectorComponent {
  @Input() years: number[] = [];
  @Input() year = new Date().getFullYear();
  @Input() month: number | null = null;
  @Input() canGoPrevious = false;
  @Input() canGoNext = false;

  @Output() yearChange = new EventEmitter<number>();
  @Output() monthChange = new EventEmitter<number | null>();
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  readonly months = MONTHS;
}
