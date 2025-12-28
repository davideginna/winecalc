# 🏗️ Architettura WineCalc

Documentazione tecnica dell'architettura e del flusso dati dell'applicazione WineCalc.

## 📐 Panoramica Architettura

WineCalc utilizza un'architettura **modulare basata su configurazione JSON** per permettere l'aggiunta facile di nuovi calcolatori senza dover modificare il codice core.

### Principi Architetturali

1. **Configurazione over Codice**: I calcolatori sono definiti in file JSON, non hardcoded
2. **Separazione delle Responsabilità**: Ogni modulo ha un compito specifico
3. **Generazione Dinamica**: I form HTML vengono generati automaticamente dalla configurazione
4. **Multilingua First**: Tutte le stringhe passano attraverso i18next
5. **Nessuna Dipendenza Backend**: Applicazione completamente client-side

---

## 📊 Flusso Dati Completo

```
┌──────────────────────────────────────────────────────────────────┐
│                        UTENTE                                     │
│  Compila form: volume=100, additionRate=10                       │
│  Clicca "Calcola"                                                │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│  1. EVENT LISTENER                                               │
│  Modulo: FormHandler                                             │
│  File: js/modules/form-handler.js                                │
│                                                                   │
│  form.addEventListener('submit', ...)                            │
│  • Blocca il submit tradizionale (preventDefault)                │
│  • Chiama handleSubmit(calculatorId, form)                       │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│  2. RACCOLTA DATI                                                │
│  Funzione: WineCalcUtils.getFormData(form)                       │
│  File: js/utils.js                                               │
│                                                                   │
│  Input:  <form> HTML element                                     │
│  Output: { volume: "100", additionRate: "10" }                   │
│  Nota:   I valori sono ancora STRINGHE                           │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│  3. CONVERSIONE TIPI                                             │
│  Funzione: FormHandler.convertToNumbers(data)                    │
│  File: js/modules/form-handler.js                                │
│                                                                   │
│  Input:  { volume: "100", additionRate: "10" }                   │
│  Output: { volume: 100, additionRate: 10 }                       │
│  Logica: Converte in numero se isNaN() è false                   │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│  4. ESECUZIONE CALCOLO                                           │
│  Funzione: window.calculate_acid(data)                           │
│  File: js/calculators/acid.js                                    │
│                                                                   │
│  Input:  { volume: 100, additionRate: 10 }                       │
│                                                                   │
│  Logica del Calcolatore:                                         │
│  1. Validazione input (errori → throw Error)                     │
│  2. Esecuzione formula                                           │
│     const amountKg = (additionRate × volume) / 1000              │
│     const amountG = additionRate × volume                        │
│  3. Arrotondamento risultati                                     │
│                                                                   │
│  Output: { amountKg: 0.01, amountG: 10 }                         │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│  5. RENDERING RISULTATI                                          │
│  Funzione: ResultsRenderer.render(calculatorId, result)          │
│  File: js/modules/results-renderer.js                            │
│                                                                   │
│  Input: ('acid', { amountKg: 0.01, amountG: 10 })                │
│                                                                   │
│  Processo:                                                       │
│  Per ogni chiave in result:                                      │
│    1. Trova traduzione: t('calculators.acid.results.amountKg')  │
│    2. Trova unità: units['acid']['amountKg'] → 'kg'              │
│    3. Formatta numero: formatNumber(0.01) → "0.01"               │
│    4. Genera HTML:                                               │
│       <div class="result-item">                                  │
│         <div class="result-label">Chilogrammi...</div>           │
│         <div class="result-value">0.01 <span>kg</span></div>    │
│       </div>                                                     │
│                                                                   │
│  Output: HTML inserito in <div id="resultsContainer">            │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│  6. SALVATAGGIO STORICO (opzionale)                              │
│  Funzione: StateManager.addToHistory()                           │
│  File: js/modules/app-state.js                                   │
│                                                                   │
│  Salva calcolo nella cronologia dell'app                         │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                        UTENTE                                     │
│  Vede i risultati:                                               │
│  • Chilogrammi di acido da aggiungere: 0.01 kg                   │
│  • Grammi di acido da aggiungere: 10 g                           │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Struttura Moduli

### File di Configurazione (JSON)

#### `calculators-config.json`
```json
{
  "calculators": [
    {
      "id": "acid",              // ID univoco (usato per window.calculate_acid)
      "enabled": true,           // Mostra/nascondi calcolatore
      "category": "chemical",    // Categoria per raggruppamento
      "icon": "bi-droplet",      // Icona Bootstrap Icons
      "jsFile": "js/calculators/acid.js",  // Percorso modulo JS
      "priority": 2              // Ordine visualizzazione
    }
  ]
}
```

**Responsabilità:**
- Definisce quali calcolatori esistono
- Controlla quali sono abilitati/visibili
- Specifica dove trovare il codice JavaScript

**Usato da:** `CalculatorLoader` per generare le card nella homepage

---

#### File di Configurazione Campi: `js/calculators-fields/*.json`

Ogni calcolatore ha il proprio file JSON in `js/calculators-fields/`:

**Esempio: `js/calculators-fields/acid.json`**
```json
{
  "info": true,              // Mostra banner informativo
  "alertType": "info",       // Tipo alert (info/warning/danger)
  "fields": [
    {
      "id": "volume",        // Nome campo (diventa name/id HTML)
      "type": "number",      // Tipo input
      "label": "calculators.acid.volume",  // Chiave i18n
      "min": 0,
      "step": 0.1,
      "placeholder": "1",
      "required": true
    },
    {
      "id": "additionRate",
      "type": "number",
      "label": "calculators.acid.additionRate",
      "min": 0,
      "step": 0.1,
      "placeholder": "10",
      "required": true
    }
  ]
}
```

**Responsabilità:**
- Definisce i campi del form per UN SINGOLO calcolatore
- Specifica validazione HTML5 (min, max, step, required)
- Collega ai testi tradotti
- L'ordine dei campi in `fields` determina l'ordine visivo nel form

**Vantaggi:**
- ✅ Un file per calcolatore = facile da trovare e modificare
- ✅ Personalizzabile: cambi l'ordine riordinando l'array
- ✅ Scalabile: ogni calcolatore può essere semplice o complesso
- ✅ Nessun file monolitico con 30+ calcolatori

**Usato da:** `TemplateGenerator.loadFieldsConfig(calculatorId)` per generare dinamicamente l'HTML del form

---

### Moduli JavaScript (ES6)

#### `js/modules/calculator-loader.js`
**Responsabilità:**
- Carica `calculators-config.json`
- Genera le card HTML dei calcolatori nella homepage
- Lazy-loading dei moduli JavaScript quando necessario

**Metodi Principali:**
```javascript
loadConfig()           // Carica configurazione
generateCards()        // Genera HTML cards
loadCalculatorModule() // Carica dinamicamente il JS del calcolatore
```

---

#### `js/modules/template-generator.js`
**Responsabilità:**
- Carica il file JSON specifico del calcolatore da `js/calculators-fields/{id}.json`
- Genera dinamicamente l'HTML del form
- Supporta tipi: number, select, text
- Cache dei file caricati per performance

**Flusso:**
```javascript
generate(calculatorId)
  ↓
loadFieldsConfig(calculatorId)  // Carica js/calculators-fields/acid.json
  ↓
  → Cache hit? Ritorna config dalla cache
  → Cache miss? Fetch file JSON → salva in cache
  ↓
generateDynamicTemplate(calculatorId, config)    // Genera form HTML
  ↓
generateField() × N          // Per ogni campo definito
  ↓
Ritorna HTML completo
```

**Metodi Principali:**
```javascript
generate(calculatorId)                   // Entry point
loadFieldsConfig(calculatorId)           // Carica file specifico
generateDynamicTemplate(calculatorId, config)  // Genera template completo
generateNumberField(field)               // Input numerico
generateSelectField(field)               // Dropdown
generateTextField(field)                 // Input testo
```

**Cache:**
```javascript
fieldsConfigCache = {
    'acid': { info: true, fields: [...] },
    'so2': { info: true, fields: [...] }
}
```

---

#### `js/modules/form-handler.js`
**Responsabilità:**
- Gestisce submit del form
- Raccoglie dati dal form
- Converte stringhe in numeri
- Chiama la funzione di calcolo
- Gestisce errori

**Flusso Submit:**
```javascript
setupForm(calculatorId)
  ↓
addEventListener('submit')
  ↓
handleSubmit(calculatorId, form)
  ↓
getFormData(form)              // → { volume: "100", ... }
  ↓
convertToNumbers(data)         // → { volume: 100, ... }
  ↓
executeCalculation()
  ↓
window.calculate_acid(data)    // Chiama funzione calcolatore
  ↓
ResultsRenderer.render()       // Mostra risultati
```

**Metodi Principali:**
```javascript
setupForm(calculatorId)              // Setup event listeners
handleSubmit(calculatorId, form)     // Gestione submit
convertToNumbers(data)               // String → Number
executeCalculation(calculatorId, data)  // Esegue calcolo
handleCalculationError(error)        // Gestione errori
```

---

#### `js/modules/results-renderer.js`
**Responsabilità:**
- Riceve risultati dal calcolatore
- Trova traduzioni per ogni campo risultato
- Aggiunge unità di misura
- Genera HTML risultati
- Inserisce nel DOM

**Flusso Rendering:**
```javascript
render(calculatorId, result)
  ↓
Per ogni chiave in result:
  ↓
getResultLabel()              // Trova traduzione
  ↓
getResultUnit()               // Trova unità misura
  ↓
formatResultValue()           // Formatta numero
  ↓
renderResultItem()            // Genera HTML
  ↓
Inserisce in #resultsContainer
```

**Configurazione Unità:**
```javascript
const units = {
    acid: {
        amountKg: 'kg',
        amountG: 'g',
        additionRate: 'g/L',
        volume: 'L'
    }
};
```

**Metodi Principali:**
```javascript
render(calculatorId, result)     // Entry point
generateResultsHTML()            // Genera HTML completo
renderResultItem(calc, key, val) // Singolo campo risultato
getResultLabel(calc, key)        // Trova traduzione
getResultUnit(calc, key)         // Trova unità
formatResultValue(value)         // Formatta numero
```

---

#### `js/modules/calculator-manager.js`
**Responsabilità:**
- Gestisce apertura/chiusura modal
- Coordina caricamento calcolatore
- Gestisce cambio lingua (reload form)

**Metodi Principali:**
```javascript
openCalculator(calculatorId)     // Apre modal
loadCalculatorContent()          // Carica form nel modal
closeCalculator()                // Chiude modal
reloadCurrentCalculator()        // Ricarica (cambio lingua)
```

---

#### `js/modules/app-state.js`
**Responsabilità:**
- State management centralizzato
- Storico calcoli
- Istanza modal Bootstrap

**State:**
```javascript
{
    currentCalculator: 'acid',
    modal: BootstrapModalInstance,
    calculatorInstances: {},
    searchTerm: '',
    history: []
}
```

---

### Moduli Calcolatori

#### `js/calculators/acid.js`
**Struttura Standard:**
```javascript
/**
 * Documentazione
 */
function calculate_acid(data) {
    // 1. DESTRUTTURAZIONE INPUT
    const { volume, additionRate } = data;

    // 2. VALIDAZIONE
    if (!volume || volume <= 0) {
        throw new Error(WineCalcI18n.t('errors.volumeRequired'));
    }

    // 3. CALCOLO
    const amountKg = (additionRate * volume) / 1000;
    const amountG = additionRate * volume;

    // 4. RITORNO RISULTATI
    return {
        amountKg: Math.round(amountKg * 1000) / 1000,
        amountG: Math.round(amountG * 10) / 10
    };
}

// 5. ESPORTAZIONE
window.calculate_acid = calculate_acid;
```

**Regole per i Calcolatori:**
1. Nome funzione: `calculate_{id}` dove `{id}` è l'ID in `calculators-config.json`
2. Input: un oggetto con i dati dal form
3. Output: un oggetto con i risultati
4. Validazione: lanciare `Error` con messaggio tradotto
5. Esportazione: sempre su `window.calculate_{id}`

---

## 🌍 Sistema Multilingua (i18next)

### File Traduzioni: `locales/{lang}.json`

Struttura:
```json
{
  "calculators": {
    "acid": {
      "title": "...",           // Titolo modal
      "description": "...",     // Card descrizione
      "volume": "...",          // Label campo input
      "additionRate": "...",    // Label campo input
      "results": {
        "amountKg": "...",      // Label risultato
        "amountG": "..."        // Label risultato
      },
      "info": "..."             // Banner informativo
    }
  }
}
```

### Accesso alle Traduzioni

```javascript
// Nel codice JavaScript
WineCalcI18n.t('calculators.acid.title')
// → "Aggiunta Acido" (se lingua = IT)
// → "Acid Addition" (se lingua = EN)
```

---

## 🎯 Esempio Completo: Aggiungere "Bentonite Calculator"

### 1. Creare `js/calculators/bentonite.js`

```javascript
function calculate_bentonite(data) {
    const { volume, dosage } = data;

    if (!volume || volume <= 0) {
        throw new Error(WineCalcI18n.t('errors.volumeRequired'));
    }

    // Formula: g/hL → g totali
    const bentoniteG = (dosage * volume) / 100;
    const bentoniteKg = bentoniteG / 1000;

    // Acqua per idratazione (10x peso bentonite)
    const waterML = bentoniteG * 10;

    return {
        bentoniteG: Math.round(bentoniteG * 10) / 10,
        bentoniteKg: Math.round(bentoniteKg * 1000) / 1000,
        waterML: Math.round(waterML)
    };
}

window.calculate_bentonite = calculate_bentonite;
```

### 2. Registrare in `calculators-config.json`

```json
{
  "id": "bentonite",
  "enabled": true,
  "category": "chemical",
  "icon": "bi-funnel",
  "jsFile": "js/calculators/bentonite.js",
  "priority": 3
}
```

### 3. Configurare campi in `calculators-fields-config.json`

```json
{
  "bentonite": {
    "info": true,
    "fields": [
      {
        "id": "volume",
        "type": "number",
        "label": "calculators.bentonite.volume",
        "min": 0,
        "step": 0.1,
        "placeholder": "100",
        "required": true
      },
      {
        "id": "dosage",
        "type": "number",
        "label": "calculators.bentonite.dosage",
        "min": 0,
        "step": 1,
        "placeholder": "30",
        "required": true,
        "helpText": "Tipico: 20-80 g/hL"
      }
    ]
  }
}
```

### 4. Aggiungere traduzioni in `locales/it.json`

```json
{
  "calculators": {
    "bentonite": {
      "title": "Bentonite",
      "description": "Calcola l'aggiunta di bentonite per la chiarifica",
      "volume": "Volume (L)",
      "dosage": "Dosaggio (g/hL)",
      "results": {
        "bentoniteG": "Bentonite da aggiungere (g)",
        "bentoniteKg": "Bentonite da aggiungere (kg)",
        "waterML": "Acqua per idratazione (mL)"
      },
      "info": "La bentonite è un'argilla utilizzata per rimuovere le proteine instabili dal vino."
    }
  }
}
```

### 5. Configurare unità in `results-renderer.js`

```javascript
const units = {
    bentonite: {
        bentoniteG: 'g',
        bentoniteKg: 'kg',
        waterML: 'mL'
    }
};
```

### ✅ Fatto!

Il calcolatore bentonite è ora completamente integrato e funzionante.

---

## 🔍 Debug e Troubleshooting

### Console Browser

Ogni modulo logga informazioni utili:
```javascript
console.log('Calculator loaded:', calculatorId);
console.log('Form data:', data);
console.log('Calculation result:', result);
```

### Errori Comuni

**"Calculator not found"**
- Verifica che l'ID in `calculators-config.json` corrisponda al nome funzione
- Controlla che il file JS sia caricato (vedi Network tab in DevTools)

**"Translation missing"**
- Controlla che la chiave esista in tutti i 5 file `locales/*.json`
- Verifica la sintassi JSON (usa un validator)

**"Form fields not showing"**
- Verifica che la configurazione esista in `calculators-fields-config.json`
- Controlla la console per errori di parsing JSON

**"Results not displaying"**
- Verifica che la funzione ritorni un oggetto
- Controlla che le chiavi ritornate abbiano traduzioni in `locales/*/results`
- Aggiungi unità di misura in `results-renderer.js`

---

## 📚 Risorse Tecniche

- **Bootstrap 5.3**: https://getbootstrap.com/docs/5.3/
- **Bootstrap Icons**: https://icons.getbootstrap.com/
- **i18next**: https://www.i18next.com/
- **ES6 Modules**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- **Fetch API**: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

---

**Ultima modifica:** 2025-01-XX
**Versione architettura:** 2.0 (Sistema dinamico basato su configurazione)
