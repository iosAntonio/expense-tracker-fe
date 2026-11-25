import { ExpenseResponse } from '../services/expense.service';
import { CATEGORIES, CategoryDefinition } from './categories';

export interface MonthSummary {
  month: number;
  key: string;
  total: number;
  count: number;
}

export interface CategoryTotal extends CategoryDefinition {
  total: number;
  share: number;
}

export function sumAmounts(expenses: readonly ExpenseResponse[]): number {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

export function yearOf(expense: ExpenseResponse): number {
  return Number(expense.date.substring(0, 4));
}

/** Every year from the oldest to the newest one, without gaps, including the extra years given. */
export function yearRange(expenses: readonly ExpenseResponse[], include: number[]): number[] {
  const years = [...expenses.map(yearOf), ...include];
  const first = Math.min(...years);
  const last = Math.max(...years);

  return Array.from({ length: last - first + 1 }, (_, index) => first + index);
}

export function monthlyTotals(expenses: readonly ExpenseResponse[], year: number): MonthSummary[] {
  const totals = new Array<number>(12).fill(0);
  const counts = new Array<number>(12).fill(0);
  const prefix = `${year}-`;

  for (const expense of expenses) {
    if (expense.date.startsWith(prefix)) {
      const index = Number(expense.date.substring(5, 7)) - 1;
      totals[index] += expense.amount;
      counts[index] += 1;
    }
  }

  return totals.map((total, index) => ({
    month: index + 1,
    key: `${year}-${String(index + 1).padStart(2, '0')}`,
    total,
    count: counts[index],
  }));
}

/** Categories that have expenses, most expensive first, with their share of the total. */
export function categoryTotals(expenses: readonly ExpenseResponse[]): CategoryTotal[] {
  const totals = new Map<string, number>();

  for (const expense of expenses) {
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount);
  }

  const grandTotal = sumAmounts(expenses);

  return CATEGORIES.filter(category => (totals.get(category.key) ?? 0) > 0)
    .map(category => {
      const total = totals.get(category.key) ?? 0;

      return { ...category, total, share: total / grandTotal };
    })
    .sort((a, b) => b.total - a.total);
}
