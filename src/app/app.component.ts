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
    { date: '30/09/2026', desc: 'Diesel', category: 'Trasporti', amount: 84.00 },
    { date: '30/09/2026', desc: 'Caffè americano', category: 'Svago', amount: 3.00 },
    { date: '30/09/2026', desc: 'Fruttivendolo', category: 'Spesa', amount: 22.00 },
    { date: '01/10/2026', desc: 'Affitto', category: 'Casa', amount: 470.00 },
    { date: '01/10/2026', desc: 'Crema capelli', category: 'Personale', amount: 11.11 },
    { date: '01/10/2026', desc: 'Coca-Cola Minim Bistrot', category: 'Svago', amount: 3.50 },
    { date: '02/10/2026', desc: 'Chewing gum', category: 'Svago', amount: 1.20 },
    { date: '02/10/2026', desc: "Confezione d'acqua", category: 'Spesa', amount: 1.70 },
    { date: '02/10/2026', desc: 'Spesa supermercato', category: 'Spesa', amount: 12.20 },
    { date: '02/10/2026', desc: 'Spesa alimentare', category: 'Spesa', amount: 14.50 },
    { date: '03/10/2026', desc: 'Pesce fresco', category: 'Spesa', amount: 48.00 },
    { date: '03/10/2026', desc: 'Frutta e verdura', category: 'Spesa', amount: 20.00 },
    { date: '03/10/2026', desc: 'Colazione bar', category: 'Svago', amount: 2.80 },
    { date: '03/10/2026', desc: 'Profumo', category: 'Personale', amount: 51.00 },
    { date: '03/10/2026', desc: 'Bar / Aperitivo', category: 'Svago', amount: 11.00 },
    { date: '04/10/2026', desc: 'Aperitivo', category: 'Svago', amount: 17.50 },
    { date: '05/10/2026', desc: 'Birra', category: 'Svago', amount: 3.00 },
    { date: '06/10/2026', desc: 'Caffè', category: 'Svago', amount: 1.50 },
    { date: '06/10/2026', desc: 'Guida moto', category: 'Trasporti', amount: 30.00 },
    { date: '06/10/2026', desc: "Confezione d'acqua", category: 'Spesa', amount: 3.40 },
    { date: '07/10/2026', desc: 'Spesa alimentari', category: 'Spesa', amount: 19.80 },
    { date: '07/10/2026', desc: 'Birra', category: 'Svago', amount: 3.00 },
    { date: '08/10/2026', desc: 'Spesa Coop', category: 'Spesa', amount: 7.07 },
    { date: '08/10/2026', desc: 'Powerade', category: 'Svago', amount: 2.00 },
    { date: '08/10/2026', desc: 'Parrucchiere', category: 'Personale', amount: 25.00 },
    { date: '09/10/2026', desc: 'Regalo Tizi e Fili', category: 'Personale', amount: 20.00 },
    { date: '09/10/2026', desc: 'Caffè', category: 'Svago', amount: 3.50 },
    { date: '10/10/2026', desc: 'Pesce', category: 'Spesa', amount: 45.00 },
    { date: '10/10/2026', desc: 'Kasanova', category: 'Personale', amount: 19.00 },
    { date: '10/10/2026', desc: 'Caffettiera', category: 'Casa', amount: 1.20 },
    { date: '10/10/2026', desc: 'Brioche gelato', category: 'Svago', amount: 6.00 },
    { date: '11/10/2026', desc: 'Spesa sagra della salsiccia', category: 'Spesa', amount: 19.00 },
    { date: '11/10/2026', desc: 'Iraqueno', category: 'Svago', amount: 26.00 },
    { date: '14/10/2026', desc: 'Spesa Orto frutta', category: 'Spesa', amount: 23.00 },
    { date: '14/10/2026', desc: 'Imposta di bollo', category: 'Casa', amount: 11.10 },
    { date: '16/10/2026', desc: 'Pollo', category: 'Spesa', amount: 8.00 },
    { date: '16/10/2026', desc: 'Sapori di piana', category: 'Spesa', amount: 8.70 },
    { date: '16/10/2026', desc: 'Acqua', category: 'Spesa', amount: 1.70 },
    { date: '16/10/2026', desc: 'Caffè', category: 'Svago', amount: 1.50 },
    { date: '16/10/2026', desc: 'Pizza', category: 'Svago', amount: 18.00 },
    { date: '16/10/2026', desc: 'Formaggio', category: 'Spesa', amount: 2.50 },
    { date: '18/10/2026', desc: 'Spesa Coca Cola', category: 'Spesa', amount: 7.00 },
    { date: '19/10/2026', desc: 'Spesa caffè', category: 'Spesa', amount: 4.60 },
    { date: '19/10/2026', desc: 'Volo ritorno Marsiglia', category: 'Viaggi', amount: 18.00 },
    { date: '19/10/2026', desc: 'Volo andata Marsiglia', category: 'Viaggi', amount: 43.87 },
    { date: '19/10/2026', desc: 'Verdura', category: 'Spesa', amount: 14.00 },
    { date: '19/10/2026', desc: 'Prozis', category: 'Personale', amount: 64.46 },
    { date: '20/10/2026', desc: 'Guida moto', category: 'Trasporti', amount: 30.00 },
    { date: '21/10/2026', desc: 'Verdure', category: 'Spesa', amount: 32.00 },
    { date: '21/10/2026', desc: 'Coca Zero', category: 'Svago', amount: 4.00 },
    { date: '21/10/2026', desc: 'Regalo Angi', category: 'Personale', amount: 10.00 },
    { date: '22/10/2026', desc: 'Spesa caffè', category: 'Svago', amount: 1.50 },
    { date: '22/10/2026', desc: 'Cinema', category: 'Svago', amount: 10.00 },
    { date: '22/10/2026', desc: 'Spesa supermercato', category: 'Spesa', amount: 12.87 },
    { date: '23/10/2026', desc: 'Spesa caldaia', category: 'Casa', amount: 90.00 },
    { date: '26/10/2026', desc: 'Spesa alimentari', category: 'Spesa', amount: 7.00 },
    { date: '26/10/2026', desc: 'Antichi sapori', category: 'Svago', amount: 15.50 },
    { date: '26/10/2026', desc: 'Decò', category: 'Spesa', amount: 3.35 },
    { date: '26/10/2026', desc: 'Spesa gelato', category: 'Svago', amount: 4.80 },
    { date: '26/10/2026', desc: 'Pescheria', category: 'Spesa', amount: 30.00 },
    { date: '26/10/2026', desc: 'Caffè', category: 'Svago', amount: 2.60 },
    { date: '26/10/2026', desc: 'Hamburger', category: 'Svago', amount: 5.90 },
    { date: '26/10/2026', desc: 'Volo New York', category: 'Viaggi', amount: 1071.28 },
    { date: '27/10/2026', desc: 'Volo', category: 'Viaggi', amount: 40.83 },
    { date: '28/10/2026', desc: 'Lidl spesa', category: 'Spesa', amount: 1.14 },
    { date: '28/10/2026', desc: 'Octopus corrente', category: 'Casa', amount: 68.00 },
    { date: '29/10/2026', desc: 'Disney', category: 'Personale', amount: 7.00 },
    { date: '29/10/2026', desc: 'Voli spesa', category: 'Viaggi', amount: 39.53 },
    { date: '29/10/2026', desc: 'Volo', category: 'Viaggi', amount: 47.03 },
    { date: '30/10/2026', desc: 'Gas bolletta', category: 'Casa', amount: 18.48 },
    { date: '30/10/2026', desc: 'Caffè', category: 'Svago', amount: 4.00 }
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
