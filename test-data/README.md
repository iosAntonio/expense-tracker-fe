# Dati di test 2025-2026

`spese-2025-2026.json` contiene spese realistiche per tutti i 24 mesi del 2025 e del 2026,
da caricare dalla pagina Import. È generato in modo deterministico: i valori qui sotto
sono quelli che la dashboard deve mostrare dopo l'import su un database vuoto.

Casi coperti: 1° gennaio e 31 dicembre di entrambi gli anni, 28 febbraio (anni non
bisestili), mesi da 30 e 31 giorni, spese ricorrenti (affitto, palestra, abbonamento,
bollette bimestrali) e stagionali (vacanze, Black Friday, Natale), descrizione e metodo di
pagamento nulli, una descrizione lunga, caratteri speciali (à, è, «», &, –), tutte le 11
categorie e dicembre 2026 come mese futuro rispetto alla data in cui è stato generato.

## 2025

- spese: **231**, totale **20.234,67 €**
- media dei mesi con spese: **1.686,22 €**
- mese più alto: **agosto, 2.466,22 €**

| Mese | Spese | Totale |
|---|---:|---:|
| gennaio | 15 | 1.389,21 € |
| febbraio | 18 | 1.596,43 € |
| marzo | 22 | 2.134,56 € |
| aprile | 17 | 1.503,07 € |
| maggio | 21 | 1.713,75 € |
| giugno | 20 | 1.777,51 € |
| luglio | 15 | 1.309,56 € |
| agosto | 24 | 2.466,22 € |
| settembre | 21 | 1.476,74 € |
| ottobre | 18 | 1.473,57 € |
| novembre | 19 | 1.674,62 € |
| dicembre | 21 | 1.719,43 € |

## 2026

- spese: **230**, totale **21.119,30 €**
- media dei mesi con spese: **1.759,94 €**
- mese più alto: **agosto, 2.381,07 €**

| Mese | Spese | Totale |
|---|---:|---:|
| gennaio | 19 | 1.624,11 € |
| febbraio | 16 | 1.501,10 € |
| marzo | 18 | 1.975,41 € |
| aprile | 21 | 1.949,16 € |
| maggio | 22 | 1.605,58 € |
| giugno | 17 | 1.510,36 € |
| luglio | 20 | 1.734,74 € |
| agosto | 22 | 2.381,07 € |
| settembre | 20 | 1.840,90 € |
| ottobre | 18 | 1.643,05 € |
| novembre | 19 | 1.581,46 € |
| dicembre | 18 | 1.772,36 € |

Totale complessivo: **461 spese**, **41.353,97 €**.

Il file è statico: se lo modifichi, aggiorna anche i totali qui sopra.
