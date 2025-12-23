# Calculator Fields Configuration

Questa cartella contiene i file di configurazione per i campi dei form di ogni calcolatore.

## Struttura

Ogni calcolatore ha il proprio file JSON:
```
js/calculators-fields/
├── acid.json          → Configurazione per il calcolatore "acid"
├── so2.json           → Configurazione per il calcolatore "so2"
├── bentonite.json     → Configurazione per il calcolatore "bentonite"
└── ...
```

## Formato File

Ogni file JSON ha questa struttura:

```json
{
  "info": true,              // Mostra banner informativo sopra il form
  "alertType": "info",       // Tipo alert: "info", "warning", "danger"
  "fields": [                // Array di campi INPUT (l'ordine determina l'ordine nel form)
    {
      "id": "volume",        // ID campo (diventa name e id HTML)
      "type": "number",      // Tipo: "number", "select", "text"
      "label": "calculators.acid.volume",  // Chiave i18n per la label
      "min": 0,              // Valore minimo (solo number)
      "max": 100,            // Valore massimo (opzionale, solo number)
      "step": 0.1,           // Step incremento (solo number)
      "placeholder": "1",    // Testo placeholder
      "required": true,      // Campo obbligatorio?
      "helpText": "..."      // Testo di aiuto sotto il campo (opzionale)
    }
  ],
  "results": {               // Configurazione RISULTATI
    "order": ["amountKg", "amountG"],  // Ordine visualizzazione risultati
    "units": {               // Unità di misura per campo
      "amountKg": "kg",
      "amountG": "g"
    },
    "decimals": {            // Numero decimali per campo
      "amountKg": 3,
      "amountG": 1
    }
  }
}
```

## Tipi di Campo

### 1. Number (Input Numerico)

```json
{
  "id": "volume",
  "type": "number",
  "label": "calculators.acid.volume",
  "min": 0,
  "step": 0.1,
  "placeholder": "100",
  "required": true
}
```

Genera:
```html
<input type="number" id="volume" name="volume"
       min="0" step="0.1" placeholder="100" required>
```

### 2. Select (Dropdown)

```json
{
  "id": "acidType",
  "type": "select",
  "label": "calculators.acid.acidType",
  "required": true,
  "options": [
    {
      "value": "tartaric",
      "label": "calculators.acid.types.tartaric"
    },
    {
      "value": "citric",
      "label": "calculators.acid.types.citric"
    }
  ]
}
```

Genera:
```html
<select id="acidType" name="acidType" required>
  <option value="tartaric">Acido Tartarico</option>
  <option value="citric">Acido Citrico</option>
</select>
```

### 3. Text (Input Testuale)

```json
{
  "id": "note",
  "type": "text",
  "label": "calculators.acid.note",
  "placeholder": "Note opzionali"
}
```

Genera:
```html
<input type="text" id="note" name="note" placeholder="Note opzionali">
```

## Come Cambiare l'Ordine dei Campi

Vuoi che "additionRate" appaia PRIMA di "volume"?

**Prima:**
```json
{
  "fields": [
    { "id": "volume", ... },
    { "id": "additionRate", ... }
  ]
}
```

**Dopo:**
```json
{
  "fields": [
    { "id": "additionRate", ... },
    { "id": "volume", ... }
  ]
}
```

L'ordine nell'array `fields` determina l'ordine visivo nel form!

## Alert Banner

### Alert Informativo (Default)
```json
{
  "info": true,
  "alertType": "info"  // Sfondo blu
}
```

### Alert Warning
```json
{
  "info": true,
  "alertType": "warning"  // Sfondo giallo
}
```

### Alert Danger
```json
{
  "info": true,
  "alertType": "danger"  // Sfondo rosso
}
```

### Nessun Alert
```json
{
  "info": false
}
```

## Validazione

I campi supportano validazione HTML5 automatica:

- `required: true` → Campo obbligatorio
- `min: 0` → Valore minimo (number)
- `max: 100` → Valore massimo (number)
- `step: 0.1` → Step incremento (number)

## Testo di Aiuto

Aggiungi testo sotto un campo:

```json
{
  "id": "dosage",
  "type": "number",
  "helpText": "Tipico: 20-80 g/hL"
}
```

Genera:
```html
<input ...>
<div class="form-text">Tipico: 20-80 g/hL</div>
```

## Configurazione Risultati

### Ordine dei Risultati

L'array `order` determina l'ordine di visualizzazione:

```json
{
  "results": {
    "order": ["amountKg", "amountG"]
  }
}
```

**Prima (senza order):** Ordine casuale
**Dopo:** Prima amountKg, poi amountG

### Unità di Misura

Specifica l'unità per ogni campo risultato:

```json
{
  "results": {
    "units": {
      "amountKg": "kg",
      "amountG": "g",
      "volume": "L",
      "concentration": "mg/L"
    }
  }
}
```

### Decimali

Controlla quanti decimali mostrare per ogni campo:

```json
{
  "results": {
    "decimals": {
      "amountKg": 3,    // 0.010 kg
      "amountG": 1,     // 10.5 g
      "percentage": 0   // 95%
    }
  }
}
```

**Nota:** Se non specifichi decimals per un campo, userà la formattazione di default.

### Nascondere Campi

Se il tuo calcolatore ritorna campi che non vuoi mostrare, semplicemente **non includerli** nell'array `order`:

```javascript
// Funzione ritorna:
return {
  amountKg: 0.01,
  amountG: 10,
  internalCalculation: 1234  // Campo interno
};

// Config mostra solo i primi due:
{
  "results": {
    "order": ["amountKg", "amountG"]  // internalCalculation non viene mostrato
  }
}
```

## Processo di Rendering

### Form (Input)

1. `TemplateGenerator.loadFieldsConfig('acid')` carica `acid.json`
2. Per ogni oggetto in `fields[]`:
   - Genera HTML in base al `type`
   - Traduce `label` usando i18next
   - Applica attributi (min, max, step, required, etc.)
3. Inserisce il form nel modal

### Risultati (Output)

1. `ResultsRenderer.loadResultsConfig('acid')` carica `acid.json`
2. Legge la sezione `results`:
   - Usa `order` per determinare l'ordine
   - Applica `units` per le unità
   - Applica `decimals` per l'arrotondamento
3. Genera HTML risultati
4. Inserisce in `resultsContainer`

## Best Practices

✅ **Un campo per riga** per leggibilità
✅ **Ordina i campi logicamente** (es. prima input, poi opzioni)
✅ **Usa placeholder significativi** che mostrino esempi reali
✅ **Aggiungi helpText** per campi complessi
✅ **Valida con required/min/max** quando possibile

❌ **Non duplicare ID** tra campi dello stesso calcolatore
❌ **Non dimenticare le traduzioni** in `locales/*.json`
❌ **Non usare caratteri speciali negli ID** (solo lettere, numeri, underscore)

## Esempio Completo

Vedi `acid.json` per un esempio funzionante e testato.
