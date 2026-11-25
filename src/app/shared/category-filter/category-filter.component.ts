import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { CATEGORIES, CATEGORY_BY_KEY, CATEGORY_KEYS } from '../../core/categories';

let nextId = 0;

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss'],
})
export class CategoryFilterComponent {
  @Input() selected: readonly string[] = [];
  @Output() selectedChange = new EventEmitter<string[]>();

  @ViewChild('toggleButton') private toggleButton?: ElementRef<HTMLButtonElement>;

  readonly categories = CATEGORIES;
  readonly panelId = `category-filter-${nextId++}`;
  open = false;

  constructor(private host: ElementRef<HTMLElement>) {}

  get label(): string {
    if (this.selected.length === 0 || this.selected.length === CATEGORY_KEYS.length) {
      return 'Tutte le categorie';
    }

    if (this.selected.length === 1) {
      const category = CATEGORY_BY_KEY.get(this.selected[0]);

      return category ? `${category.emoji} ${category.name}` : '1 categoria';
    }

    return `${this.selected.length} categorie`;
  }

  isSelected(key: string): boolean {
    return this.selected.includes(key);
  }

  toggle(key: string): void {
    const next = this.isSelected(key)
      ? this.selected.filter(selectedKey => selectedKey !== key)
      : CATEGORY_KEYS.filter(categoryKey => categoryKey === key || this.isSelected(categoryKey));

    this.selectedChange.emit(next);
  }

  showAll(): void {
    this.selectedChange.emit([]);
  }

  toggleOpen(): void {
    this.open = !this.open;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.open && !this.host.nativeElement.contains(event.target as Node)) {
      this.open = false;
    }
  }

  @HostListener('keydown.escape')
  onEscape(): void {
    if (this.open) {
      this.open = false;
      this.toggleButton?.nativeElement.focus();
    }
  }
}
