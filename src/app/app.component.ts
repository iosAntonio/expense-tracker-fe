import { Component } from '@angular/core';

interface ExpenseCategory {
  key: string;
  name: string;
  emoji: string;
  color: string;
  total: number;
}

interface Transaction {
  date: string;
  desc: string;
  category: string;
  amount: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly title = 'expense-tracker-frontend';
  readonly totalExpenses = 2792.72;
  readonly categories: ExpenseCategory[] = [
    { key: 'Viaggi', name: 'Viaggi & Spostamenti', emoji: '✈️', color: '#6366f1', total: 1258.71 },
    { key: 'Casa', name: 'Casa & Utenze', emoji: '🏠', color: '#3b82f6', total: 667.58 },
    { key: 'Spesa', name: 'Spesa & Alimentari', emoji: '🛒', color: '#10b981', total: 338.98 },
    { key: 'Personale', name: 'Regali & Cura Personale', emoji: '🎁', color: '#ec4899', total: 241.15 },
    { key: 'Trasporti', name: 'Trasporti & Auto', emoji: '🚗', color: '#f59e0b', total: 144.00 },
    { key: 'Svago', name: 'Bar, Ristoranti & Svago', emoji: '🍽️', color: '#8b5cf6', total: 142.30 }
  ];

  readonly transactions: Transaction[] = [
    { date: '30/09/2026', desc: 'Rifornimento carburante', category: 'Trasporti', amount: 72.40 },
    { date: '30/09/2026', desc: 'Colazione in centro', category: 'Svago', amount: 6.80 },
    { date: '30/09/2026', desc: 'Verdura di stagione', category: 'Spesa', amount: 18.60 },
    { date: '01/10/2026', desc: 'Canone mensile appartamento', category: 'Casa', amount: 520.00 },
    { date: '01/10/2026', desc: 'Prodotti per la cura dei capelli', category: 'Personale', amount: 16.90 },
    { date: '01/10/2026', desc: 'Pranzo al bistrot', category: 'Svago', amount: 14.50 },
    { date: '02/10/2026', desc: 'Snack al minimarket', category: 'Svago', amount: 2.40 },
    { date: '02/10/2026', desc: 'Acqua naturale', category: 'Spesa', amount: 1.20 },
    { date: '02/10/2026', desc: 'Spesa settimanale', category: 'Spesa', amount: 38.75 },
    { date: '02/10/2026', desc: 'Ingredienti per cena', category: 'Spesa', amount: 21.30 },
    { date: '03/10/2026', desc: 'Pesce per il pranzo', category: 'Spesa', amount: 32.80 },
    { date: '03/10/2026', desc: 'Frutta fresca', category: 'Spesa', amount: 12.50 },
    { date: '03/10/2026', desc: 'Cappuccino e cornetto', category: 'Svago', amount: 4.60 },
    { date: '03/10/2026', desc: 'Acquisto profumo', category: 'Personale', amount: 58.00 },
    { date: '03/10/2026', desc: 'Aperitivo con amici', category: 'Svago', amount: 18.00 },
    { date: '04/10/2026', desc: 'Brunch della domenica', category: 'Svago', amount: 24.00 },
    { date: '05/10/2026', desc: 'Birra artigianale', category: 'Svago', amount: 5.50 },
    { date: '06/10/2026', desc: 'Caffè al bar', category: 'Svago', amount: 1.80 },
    { date: '06/10/2026', desc: 'Lezione di guida', category: 'Trasporti', amount: 28.00 },
    { date: '06/10/2026', desc: 'Bevande per casa', category: 'Spesa', amount: 6.20 },
    { date: '07/10/2026', desc: 'Frutta e verdura', category: 'Spesa', amount: 24.90 },
    { date: '07/10/2026', desc: 'Birra al pub', category: 'Svago', amount: 4.50 },
    { date: '08/10/2026', desc: 'Spesa al supermercato', category: 'Spesa', amount: 31.45 },
    { date: '08/10/2026', desc: 'Bibita energetica', category: 'Svago', amount: 2.50 },
    { date: '08/10/2026', desc: 'Taglio e piega', category: 'Personale', amount: 32.00 },
    { date: '09/10/2026', desc: 'Regalo di compleanno', category: 'Personale', amount: 35.00 },
    { date: '09/10/2026', desc: 'Caffè con collega', category: 'Svago', amount: 3.20 },
    { date: '10/10/2026', desc: 'Pesce fresco al mercato', category: 'Spesa', amount: 39.50 },
    { date: '10/10/2026', desc: 'Articoli per la casa', category: 'Personale', amount: 23.90 },
    { date: '10/10/2026', desc: 'Accessori per la cucina', category: 'Casa', amount: 14.80 },
    { date: '10/10/2026', desc: 'Gelato dopo cena', category: 'Svago', amount: 7.50 },
    { date: '11/10/2026', desc: 'Spesa al mercato locale', category: 'Spesa', amount: 27.60 },
    { date: '11/10/2026', desc: 'Cena fuori', category: 'Svago', amount: 34.00 },
    { date: '14/10/2026', desc: 'Frutta e ortaggi freschi', category: 'Spesa', amount: 19.80 },
    { date: '14/10/2026', desc: 'Spese bancarie', category: 'Casa', amount: 2.50 },
    { date: '16/10/2026', desc: 'Pollo per cena', category: 'Spesa', amount: 10.40 },
    { date: '16/10/2026', desc: 'Prodotti tipici locali', category: 'Spesa', amount: 16.70 },
    { date: '16/10/2026', desc: 'Acqua minerale', category: 'Spesa', amount: 2.40 },
    { date: '16/10/2026', desc: 'Espresso al bar', category: 'Svago', amount: 1.50 },
    { date: '16/10/2026', desc: 'Cena in pizzeria', category: 'Svago', amount: 22.00 },
    { date: '16/10/2026', desc: 'Formaggi locali', category: 'Spesa', amount: 8.90 },
    { date: '18/10/2026', desc: 'Spesa per la dispensa', category: 'Spesa', amount: 26.40 },
    { date: '19/10/2026', desc: 'Caffè macinato', category: 'Spesa', amount: 6.80 },
    { date: '19/10/2026', desc: 'Biglietto aereo per Lisbona', category: 'Viaggi', amount: 86.50 },
    { date: '19/10/2026', desc: 'Volo di ritorno da Lisbona', category: 'Viaggi', amount: 94.20 },
    { date: '19/10/2026', desc: 'Verdura per la settimana', category: 'Spesa', amount: 17.30 },
    { date: '19/10/2026', desc: 'Integratori alimentari', category: 'Personale', amount: 29.90 },
    { date: '20/10/2026', desc: 'Corso di guida', category: 'Trasporti', amount: 28.00 },
    { date: '21/10/2026', desc: 'Verdure fresche dal mercato', category: 'Spesa', amount: 21.70 },
    { date: '21/10/2026', desc: 'Bibita al bar', category: 'Svago', amount: 3.80 },
    { date: '21/10/2026', desc: 'Pensiero per un amico', category: 'Personale', amount: 18.00 },
    { date: '22/10/2026', desc: 'Caffè da asporto', category: 'Svago', amount: 2.20 },
    { date: '22/10/2026', desc: 'Biglietti per il teatro', category: 'Svago', amount: 26.00 },
    { date: '22/10/2026', desc: 'Spesa per la cena', category: 'Spesa', amount: 19.65 },
    { date: '23/10/2026', desc: 'Manutenzione impianto di riscaldamento', category: 'Casa', amount: 125.00 },
    { date: '26/10/2026', desc: 'Prodotti per la colazione', category: 'Spesa', amount: 13.20 },
    { date: '26/10/2026', desc: 'Cena in trattoria', category: 'Svago', amount: 28.50 },
    { date: '26/10/2026', desc: 'Detersivi e prodotti per la casa', category: 'Spesa', amount: 18.90 },
    { date: '26/10/2026', desc: 'Dolce in gelateria', category: 'Svago', amount: 6.50 },
    { date: '26/10/2026', desc: 'Pesce al mercato', category: 'Spesa', amount: 34.00 },
    { date: '26/10/2026', desc: 'Cappuccino', category: 'Svago', amount: 2.80 },
    { date: '26/10/2026', desc: 'Pranzo con hamburger', category: 'Svago', amount: 16.50 },
    { date: '26/10/2026', desc: 'Volo per Barcellona', category: 'Viaggi', amount: 184.60 },
    { date: '27/10/2026', desc: 'Treno per Bologna', category: 'Viaggi', amount: 36.90 },
    { date: '28/10/2026', desc: 'Spesa al discount', category: 'Spesa', amount: 22.75 },
    { date: '28/10/2026', desc: 'Bolletta elettrica', category: 'Casa', amount: 74.30 },
    { date: '29/10/2026', desc: 'Abbonamento streaming', category: 'Personale', amount: 9.99 },
    { date: '29/10/2026', desc: 'Volo per Barcellona', category: 'Viaggi', amount: 176.40 },
    { date: '29/10/2026', desc: 'Prenotazione treno', category: 'Viaggi', amount: 42.80 },
    { date: '30/10/2026', desc: 'Bolletta del gas', category: 'Casa', amount: 46.70 },
    { date: '30/10/2026', desc: 'Caffè al bancone', category: 'Svago', amount: 1.40 }
  ];

  selectedCategory = 'ALL';
  searchTerm = '';

  get filteredTransactions(): Transaction[] {
    const search = this.searchTerm.trim().toLocaleLowerCase('it-IT');
    return [...this.transactions].reverse().filter(transaction => {
      const matchesCategory = this.selectedCategory === 'ALL' || transaction.category === this.selectedCategory;
      const matchesSearch = transaction.desc.toLocaleLowerCase('it-IT').includes(search) || transaction.date.includes(search);
      return matchesCategory && matchesSearch;
    });
  }

  get filteredTotal(): number {
    return this.filteredTransactions.reduce((total, transaction) => total + transaction.amount, 0);
  }

  get chartGradient(): string {
    let position = 0;
    const segments = this.categories.map(category => {
      const start = position;
      position += category.total / this.totalExpenses * 100;
      return `${category.color} ${start}% ${position}%`;
    });
    return `conic-gradient(${segments.join(', ')})`;
  }

  percentage(category: ExpenseCategory): string {
    return ((category.total / this.totalExpenses) * 100).toFixed(1);
  }

  categoryFor(key: string): ExpenseCategory | undefined {
    return this.categories.find(category => category.key === key);
  }

  formatEUR(value: number): string {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  onCategoryChange(event: Event): void {
    this.selectedCategory = (event.target as HTMLSelectElement).value;
  }
}
