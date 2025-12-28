# WineCalc - Development Guide

Guida rapida per lo sviluppo locale di WineCalc.

## Setup Iniziale

```bash
# Installa le dipendenze
npm install
```

## Comandi Disponibili

### Server di Sviluppo

```bash
# Avvia il server locale (Node.js)
npm start

# Oppure
npm run dev
```

Il server partirà su `http://localhost:8000`

**Per mobile/altri dispositivi sulla stessa rete:**
1. Avvia il server con `npm start`
2. Trova il tuo IP locale:
   - Linux/Mac: `ifconfig | grep inet` o `ip addr show`
   - Windows: `ipconfig`
3. Accedi da mobile: `http://[TUO_IP]:8000`

### Testing

```bash
# Esegui tutti i test (veloce)
npm test

# Esegui test in modalità watch (auto-rerun quando modifichi file)
npm run test:watch

# Esegui test con report di copertura
npm run test:coverage
```

## Cartelle da NON committare

Le seguenti cartelle sono già nel `.gitignore` e **NON vanno committate**:

- `node_modules/` - Dipendenze npm (si reinstallano con `npm install`)
- `coverage/` - Report di copertura test (si genera con `npm run test:coverage`)
- `package-lock.json` - Lock file npm (già ignorato)

## Workflow Sviluppo

### 1. Sviluppo Normale

```bash
# Terminal 1: Server locale
npm start

# Terminal 2: Test in watch mode (opzionale)
npm run test:watch
```

Ora puoi:
- Aprire `http://localhost:8000` nel browser
- Modificare i file
- I test si rieseguono automaticamente (se hai lanciato test:watch)

### 2. Prima di Committare

```bash
# Esegui tutti i test
npm test

# Se tutto passa ✅, puoi committare
git add .
git commit -m "tuo messaggio"
git push
```

### 3. GitHub Actions

Quando fai push, GitHub eseguirà automaticamente:
- ✅ Test su Node.js 18.x e 20.x
- ✅ Report di copertura
- ✅ Verifica che tutto funzioni

## Aggiungere un Nuovo Calcolatore

1. Crea il file calcolatore: `js/calculators/nomeCalcolatore.js`
2. Usa naming camelCase per funzione: `calculateNomeCalcolatore`
3. Aggiungi validazione con `isNaN()` per tutti i campi numerici
4. Esporta: `window.calculateNomeCalcolatore = calculateNomeCalcolatore`
5. Aggiungi test in `tests/calculators.test.js`
6. Esegui `npm test` per verificare

## Struttura Test

Ogni calcolatore deve avere:

```javascript
describe('Nome Calcolatore', () => {
    test('function exists', () => {
        expect(typeof window.calculateNome).toBe('function');
    });

    test('throws error on invalid input', () => {
        expect(() => window.calculateNome({})).toThrow();
    });

    test('calculates correctly', () => {
        const result = window.calculateNome({ input: 100 });
        expect(result.output).toBe(expectedValue);
    });
});
```

## Troubleshooting

### Il server non parte

```bash
# Verifica che le dipendenze siano installate
npm install

# Riprova
npm start
```

### I test falliscono

```bash
# Esegui test con output dettagliato
npm test -- --verbose

# Controlla il coverage per vedere cosa manca
npm run test:coverage
```

### Errori CORS

Il server `serve` gestisce automaticamente CORS, quindi non dovresti avere problemi.
Se li hai, verifica che stai usando `http://localhost:8000` e non `file://`.

## Migrazione da Python

**Prima:**
```bash
python3 -m http.server 8000
```

**Ora:**
```bash
npm start
```

Stesso risultato, stesso comportamento! 🎉

## Risorse

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Serve Documentation](https://github.com/vercel/serve)
- Test: `tests/README.md`
- Formule: `formulas/README.md`
