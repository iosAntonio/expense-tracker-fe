import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CATEGORY_KEYS } from '../../core/categories';
import { CategoryFilterComponent } from './category-filter.component';

describe('CategoryFilterComponent', () => {
  let fixture: ComponentFixture<CategoryFilterComponent>;
  let component: CategoryFilterComponent;
  let element: HTMLElement;
  let emitted: string[][];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryFilterComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    emitted = [];
    component.selectedChange.subscribe(keys => emitted.push(keys));
    fixture.detectChanges();
  });

  function button(): HTMLButtonElement {
    return element.querySelector('.filter-button') as HTMLButtonElement;
  }

  function panel(): HTMLElement | null {
    return element.querySelector('.filter-panel');
  }

  function checkbox(name: string): HTMLInputElement {
    const option = Array.from(element.querySelectorAll('.option')).find(
      item => item.querySelector('.option-name')?.textContent?.trim() === name
    );

    return option?.querySelector('input') as HTMLInputElement;
  }

  function open(): void {
    button().click();
    fixture.detectChanges();
  }

  it('shows the current choice in its label', () => {
    expect(button().textContent).toContain('Tutte le categorie');

    component.selected = ['CASA'];
    fixture.detectChanges();
    expect(button().textContent).toContain('Casa & Utenze');

    component.selected = ['CASA', 'AUTO', 'SPORT'];
    fixture.detectChanges();
    expect(button().textContent).toContain('3 categorie');

    component.selected = [...CATEGORY_KEYS];
    fixture.detectChanges();
    expect(button().textContent).toContain('Tutte le categorie');
  });

  it('lists every category and reports the new choice in the usual order', () => {
    component.selected = ['SALUTE'];
    open();

    expect(element.querySelectorAll('.option').length).toBe(11);
    expect(checkbox('Salute').checked).toBeTrue();
    expect(button().getAttribute('aria-expanded')).toBe('true');

    checkbox('Spesa & Alimentari').click();
    checkbox('Salute').click();

    expect(emitted).toEqual([['ALIMENTARI', 'SALUTE'], []]);
  });

  it('goes back to all categories with «Mostra tutte»', () => {
    component.selected = ['CASA'];
    open();

    (element.querySelector('.show-all') as HTMLButtonElement).click();
    expect(emitted).toEqual([[]]);

    component.selected = [];
    fixture.detectChanges();
    expect((element.querySelector('.show-all') as HTMLButtonElement).disabled).toBeTrue();
  });

  it('closes when clicking outside or pressing Escape', () => {
    open();
    expect(panel()).not.toBeNull();

    document.body.click();
    fixture.detectChanges();
    expect(panel()).toBeNull();

    open();
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(panel()).toBeNull();
    expect(button().getAttribute('aria-expanded')).toBe('false');
  });
});
