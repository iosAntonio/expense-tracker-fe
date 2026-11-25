# Expense Tracker: front-end

Applicazione Angular 13 per tenere traccia delle spese personali:

- **Dashboard**: andamento dei 12 mesi dell'anno e ripartizione per categoria
- **Spese**: registro per mese o per anno, filtri per categoria, modifica ed eliminazione
- **Import**: caricamento di file JSON, registro degli import con annullamento

Il back-end è in [expense-tracker-be](https://github.com/iosAntonio/expense-tracker-be).

## Board dei task

Tutti i task del progetto, front-end e back-end, sono sulla board: https://claude.ai/artifact/BA5NjWm9KAbVcEfcdq7uye
Per aprirla serve che il proprietario te l'abbia condivisa.

Istantanea del 25/11/2026. Lo stato aggiornato è sempre sulla board.

### Da fare (1)

| Task | Titolo | Tipo | Area | Priorità |
|---|---|---|---|---|
| ET-30 | Concordare il workflow Git per i due repository | Task | Product | Alta |

### In corso (1)

| Task | Titolo | Tipo | Area | Priorità |
|---|---|---|---|---|
| ET-41 | Committare e aprire le PR del lavoro fatto finora | Task | DevOps | Massima |

### In review (27)

| Task | Titolo | Tipo | Area | Priorità |
|---|---|---|---|---|
| ET-1 | Backend iniziale: API spese con Postgres e Flyway | Storia | BE | Alta |
| ET-2 | Ambiente locale con Docker per FE, BE e database | Task | DevOps | Alta |
| ET-4 | La suite di test del front-end non compila | Bug | FE | Massima |
| ET-5 | La build di produzione del front-end non compila | Bug | FE | Alta |
| ET-6 | KPI della dashboard con valori finti fissi nel template | Bug | FE | Alta |
| ET-7 | Le spese prima di ottobre 2026 non si possono consultare | Bug | FE | Media |
| ET-8 | Import: dire all'utente quante spese erano già presenti | Bug | FE | Media |
| ET-14 | Togliere .claude/settings.local.json dal repository | Debito tecnico | FE | Media |
| ET-15 | Import: risposta con il riepilogo di spese importate e saltate | Task | BE | Media |
| ET-19 | Test di integrazione del back-end | Task | BE | Alta |
| ET-31 | Registro degli import con impronta del contenuto | Storia | BE | Alta |
| ET-32 | Annullare un import in blocco | Storia | BE | Alta |
| ET-33 | Avviso «file già importato» nell'anteprima dell'import | Storia | FE | Alta |
| ET-34 | Sezione «Import recenti» con annullamento | Storia | FE | Alta |
| ET-35 | Toast di esito per import e annullamento | Storia | FE | Media |
| ET-36 | API per modificare ed eliminare spese, anche un mese intero | Storia | BE | Alta |
| ET-37 | Modificare ed eliminare una spesa dalla tabella | Storia | FE | Alta |
| ET-38 | Eliminare tutte le spese del mese selezionato | Storia | FE | Alta |
| ET-42 | Navigare per anno e mese, anche fra anni diversi | Storia | FE | Alta |
| ET-43 | Vista annuale con l'andamento dei 12 mesi | Storia | FE | Alta |
| ET-44 | Dati e test multi-anno 2025-2026 | Task | Product | Media |
| ET-12 | Calcoli della dashboard ripetuti a ogni change detection | Debito tecnico | FE | Alta |
| ET-45 | Pagina Dashboard iniziale con andamento e ripartizione per categoria | Storia | FE | Alta |
| ET-11 | Un unico modello Categoria condiviso nel front-end | Debito tecnico | FE | Media |
| ET-9 | Colori delle categorie duplicati nel grafico | Bug | FE | Media |
| ET-46 | Filtrare per una o più categorie in Dashboard e Spese | Storia | FE | Alta |
| ET-47 | Ricostruire le funzionalità sul back-end di Antonio (develop) | Task | BE | Massima |

### Backlog (17)

| Task | Titolo | Tipo | Area | Priorità |
|---|---|---|---|---|
| ET-22 | Entrate e investimenti: modello dati e KPI reali | Storia | Product | Alta |
| ET-39 | Anteprima import: segnalare i possibili duplicati | Storia | Product | Media |
| ET-16 | Import concorrenti con lo stesso externalId restituiscono 500 | Bug | BE | Media |
| ET-18 | Limite di dimensione per l'import | Task | BE | Media |
| ET-20 | Filtri e paginazione lato server | Storia | BE | Media |
| ET-21 | Aggiungere una spesa a mano | Storia | Product | Media |
| ET-23 | Autenticazione e spese per utente | Storia | Product | Media |
| ET-24 | Aggiornare Angular 13 a una versione supportata | Debito tecnico | FE | Media |
| ET-25 | Pipeline CI su GitHub Actions | Task | DevOps | Media |
| ET-10 | Pulizia del template e del codice inutilizzato | Debito tecnico | FE | Bassa |
| ET-13 | Applicare Prettier e uniformare lo stile del codice | Debito tecnico | FE | Bassa |
| ET-17 | Messaggi di errore del BE in italiano e con il numero di riga | Task | BE | Bassa |
| ET-26 | Docker: un solo comando per avviare tutto e container più sicuri | Task | DevOps | Bassa |
| ET-27 | Documentazione API con OpenAPI e README aggiornati | Task | BE | Bassa |
| ET-28 | Decidere quale mese mostrare all'apertura della dashboard | Task | Product | Bassa |
| ET-29 | File JSON di esempio scaricabile nella pagina Import | Storia | FE | Bassa |
| ET-40 | Il registro degli import non tiene conto di modifiche ed eliminazioni | Bug | BE | Bassa |

### Fatto (1)

| Task | Titolo | Tipo | Area | Priorità |
|---|---|---|---|---|
| ET-3 | Code review iniziale di front-end e back-end | Task | Product | Media |

## Avvio con Docker

1. Avvia il back-end: nella cartella di `expense-tracker-be`, `docker compose up -d --build`.
2. In questa cartella: `docker compose up -d --build`.
3. Apri http://localhost:4200. nginx inoltra `/api` al back-end su `host.docker.internal:8080` (variabile `API_UPSTREAM`).

## Sviluppo senza Docker

`npm ci`, poi `npm start` (http://localhost:4200). In sviluppo le chiamate vanno a `http://localhost:8080/api` (`src/environments/environment.ts`).

## Test

- `docker compose run --rm --build test`: test unitari in Chrome headless, dentro Docker
- `npm run format:check`: controllo della formattazione con Prettier

## Dati di prova

`test-data/spese-2025-2026.json` contiene 461 spese sui 24 mesi del 2025 e del 2026. I totali attesi sono in `test-data/README.md`.
