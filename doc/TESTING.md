# Testing e Coverage Guide

## Come Funziona la Coverage

### Cosa fa Jest quando esegui i test con coverage:

1. **Esegue tutti i test** come con `npm test`
2. **Instrumenta il codice** - aggiunge codice di tracciamento per vedere quali righe vengono eseguite
3. **Registra l'esecuzione** - segna quali righe di codice vengono "toccate" dai test
4. **Genera i report** - crea vari file di report nella cartella `coverage/`

### Generare la Coverage

```bash
npm run test:coverage
```

Questo comando:
- Esegue tutti i 37 test
- Genera la cartella `coverage/` con i report
- Mostra un riepilogo nel terminale

**Output nel terminale:**
```
-----------------------|---------|----------|---------|---------|-------------------
File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------|---------|----------|---------|---------|-------------------
All files              |   90.09 |    90.57 |     100 |   90.09 |
 acid.js               |     100 |      100 |     100 |     100 |
 ascorbicAcid.js       |   83.33 |    85.71 |     100 |   83.33 | 24,30
 ...
```

### Cosa contiene la cartella coverage/

```
coverage/
├── clover.xml               # Report in formato XML (per CI/CD tools)
├── coverage-final.json      # Report in formato JSON (usato da Codecov, Coveralls, etc.)
├── lcov.info               # Report in formato LCOV (standard per coverage)
└── lcov-report/            # Report HTML interattivo (quello che apri nel browser)
    ├── index.html          # Pagina principale con overview
    ├── acid.js.html        # Dettaglio coverage di acid.js
    ├── bentonite.js.html   # Dettaglio coverage di bentonite.js
    └── ...                 # Un file HTML per ogni calcolatore
```

**Dimensione:** ~224KB (circa 20 file HTML + CSS + JS)

### Visualizzare il Report HTML

```bash
# 1. Genera la coverage
npm run test:coverage

# 2. Apri il report nel browser
# Linux
xdg-open coverage/lcov-report/index.html

# Mac
open coverage/lcov-report/index.html

# Windows
start coverage/lcov-report/index.html
```

Nel report HTML puoi:
- ✅ Vedere la percentuale di coverage per ogni file
- ✅ Cliccare su un file per vedere riga per riga cosa è coperto
- ✅ Le righe verdi sono testate ✅
- ✅ Le righe rosse non sono testate ❌
- ✅ Le righe gialle sono parzialmente testate ⚠️

## Perché NON Pushare coverage/ su Git?

### 1. È Generata Automaticamente
La cartella `coverage/` viene creata automaticamente da Jest ogni volta che esegui `npm run test:coverage`.

```bash
# Chiunque può rigenerarla con:
npm run test:coverage

# Non serve salvarla su git!
```

### 2. È Specifica per la Macchina
I report contengono percorsi assoluti del tuo computer:
```html
<!-- Dentro coverage/lcov-report/index.html -->
<div>/home/davide/Documents/personale/winecalc/js/calculators/acid.js</div>
```

Questi percorsi sono diversi per ogni sviluppatore!

### 3. Cambia Ad Ogni Esecuzione
Ogni volta che modifichi il codice o i test, i report cambiano:
- Se aggiungi un test → coverage aumenta
- Se modifichi il codice → numeri di riga cambiano
- Se rinomini un file → i report si aggiornano

Pushare su git file che cambiano continuamente crea:
- ❌ Diff enormi ad ogni commit
- ❌ Merge conflict inutili
- ❌ Cronologia git inquinata

### 4. Occupa Spazio
- 224KB potrebbero sembrare pochi
- Ma moltiplicati per centinaia di commit = megabyte sprecati
- Git salva la cronologia di OGNI versione del file

### 5. CI/CD La Genera Automaticamente
Quando fai push su GitHub:
1. GitHub Actions esegue automaticamente i test
2. Genera la coverage
3. Carica il report su Codecov (servizio esterno)
4. Il report è disponibile online senza occupare spazio su git

## Come Funziona con GitHub Actions

Quando fai `git push`:

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm test

- name: Generate coverage report
  run: npm run test:coverage

- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v4
  with:
    file: ./coverage/coverage-final.json
```

GitHub Actions:
1. ✅ Clona il repository
2. ✅ Installa le dipendenze (`npm install`)
3. ✅ Esegue i test (`npm test`)
4. ✅ Genera coverage (`npm run test:coverage`)
5. ✅ Carica i risultati su Codecov (servizio cloud)

Il report è disponibile online, senza occupare spazio su git!

## Cosa VA Pushato su Git

✅ **Pushare:**
- `tests/` - I file di test (`.test.js`)
- `package.json` - Configurazione Jest
- `.github/workflows/test.yml` - Configurazione CI/CD
- Codice sorgente (`js/calculators/*.js`)

❌ **NON Pushare:**
- `coverage/` - Report generati
- `node_modules/` - Dipendenze npm
- `.vscode/` - Configurazione editor personale
- `package-lock.json` - (già in .gitignore)

## .gitignore Spiegato

```bash
# Nel .gitignore (riga 62):
coverage/

# Significa: ignora TUTTO dentro coverage/
# Anche se la cartella esiste, git la ignora completamente
```

Puoi verificare:
```bash
# Controlla cosa git vede
git status

# coverage/ non apparirà mai!
```

## Best Practices

### Durante lo Sviluppo

```bash
# Terminal 1: Server
npm start

# Terminal 2: Test in watch mode
npm run test:watch

# Quando modifichi il codice:
# - I test si rieseguono automaticamente
# - Vedi subito se qualcosa si rompe
```

### Prima di Committare

```bash
# 1. Esegui tutti i test
npm test

# 2. Controlla la coverage (opzionale)
npm run test:coverage

# 3. Se tutto è verde ✅, puoi committare
git add .
git commit -m "feat: aggiunto nuovo calcolatore"
git push
```

### Obiettivo Coverage

- 🎯 Target: **90%+** code coverage
- ✅ Attualmente: **90.09%** statement coverage
- ✅ **100%** function coverage (tutte le funzioni sono testate!)

## Comandi Utili

```bash
# Genera coverage e apri nel browser (Linux)
npm run test:coverage && xdg-open coverage/lcov-report/index.html

# Cancella coverage e rigenera
rm -rf coverage && npm run test:coverage

# Controlla che coverage/ sia ignorato da git
git check-ignore coverage/
# Output: coverage/  (confermato!)
```

## FAQ

**Q: Posso vedere la coverage senza generare i file HTML?**
A: Sì, `npm test` mostra già una versione semplificata nel terminale.

**Q: Devo generare coverage ad ogni commit?**
A: No! Genera solo quando vuoi controllare in dettaglio. GitHub Actions la genera automaticamente.

**Q: E se cancello per errore coverage/?**
A: Nessun problema! Basta eseguire `npm run test:coverage` e si rigenera identica.

**Q: Posso committare coverage/ se voglio?**
A: Tecnicamente sì, ma è una pessima pratica. Usa servizi cloud come Codecov invece.

**Q: Come aumento la coverage?**
A: Aggiungi più test che coprono le righe rosse nel report HTML.
