export interface CategoryDefinition {
  key: string;
  name: string;
  emoji: string;
  color: string;
}

// Corrispondenza tra enum backend e categorie visualizzate.
export const CATEGORIES: readonly CategoryDefinition[] = [
  { key: 'ALIMENTARI', name: 'Spesa & Alimentari', emoji: '🛒', color: '#10b981' },
  { key: 'BAR_RISTORAZIONE', name: 'Bar e Ristoranti', emoji: '🍽️', color: '#8b5cf6' },
  { key: 'CASA', name: 'Casa & Utenze', emoji: '🏠', color: '#3b82f6' },
  { key: 'AUTO', name: 'Auto', emoji: '🚗', color: '#f59e0b' },
  { key: 'TRASPORTI', name: 'Trasporti', emoji: '🚆', color: '#6366f1' },
  { key: 'VIAGGI', name: 'Viaggi', emoji: '✈️', color: '#f97316' },
  { key: 'SPORT', name: 'Sport', emoji: '🏐', color: '#14b8a6' },
  { key: 'SVAGO', name: 'Svago', emoji: '🎟️', color: '#84cc16' },
  { key: 'SHOPPING', name: 'Shopping', emoji: '🛍️', color: '#ec4899' },
  { key: 'SALUTE', name: 'Salute', emoji: '💊', color: '#ef4444' },
  { key: 'ALTRO', name: 'Altro', emoji: '📦', color: '#a1a1aa' },
];

export const CATEGORY_KEYS: readonly string[] = CATEGORIES.map(category => category.key);

export const CATEGORY_BY_KEY: ReadonlyMap<string, CategoryDefinition> = new Map(
  CATEGORIES.map(category => [category.key, category])
);
