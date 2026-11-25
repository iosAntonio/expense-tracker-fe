import { ExpenseResponse } from '../services/expense.service';
import { categoryTotals, monthlyTotals, sumAmounts, yearRange } from './expense-stats';

function expense(date: string, amount: number, category: string): ExpenseResponse {
  return { id: 0, date, description: null, amount, category, paymentMethod: null };
}

describe('expense statistics', () => {
  const expenses = [
    expense('2025-01-01', 25, 'BAR_RISTORAZIONE'),
    expense('2025-01-20', 80, 'ALIMENTARI'),
    expense('2025-08-10', 320, 'VIAGGI'),
    expense('2025-12-31', 90, 'BAR_RISTORAZIONE'),
    expense('2026-01-01', 30, 'BAR_RISTORAZIONE'),
  ];

  it('lists every year between the oldest and newest, extra years included', () => {
    expect(yearRange(expenses, [])).toEqual([2025, 2026]);
    expect(yearRange(expenses, [2028])).toEqual([2025, 2026, 2027, 2028]);
    expect(yearRange([], [2026])).toEqual([2026]);
  });

  it('adds up the twelve months of one year only', () => {
    const months = monthlyTotals(expenses, 2025);

    expect(months.map(month => month.key)[0]).toBe('2025-01');
    expect(months.map(month => month.total)).toEqual([105, 0, 0, 0, 0, 0, 0, 320, 0, 0, 0, 90]);
    expect(months.map(month => month.count)).toEqual([2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1]);
    expect(monthlyTotals(expenses, 2026)[0]).toEqual({
      month: 1,
      key: '2026-01',
      total: 30,
      count: 1,
    });
  });

  it('ranks the categories that have expenses by amount, with their share', () => {
    const totals = categoryTotals(expenses.slice(0, 4));

    expect(totals.map(category => [category.key, category.total])).toEqual([
      ['VIAGGI', 320],
      ['BAR_RISTORAZIONE', 115],
      ['ALIMENTARI', 80],
    ]);
    expect(totals[0].share).toBeCloseTo(320 / 515, 10);
    expect(totals.reduce((sum, category) => sum + category.share, 0)).toBeCloseTo(1, 10);
    expect(categoryTotals([])).toEqual([]);
    expect(sumAmounts(expenses)).toBe(545);
  });
});
