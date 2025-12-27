# Guida: Aggiungere un Nuovo Calcolatore

Questa guida descrive i passaggi da seguire per aggiungere un nuovo calcolatore a WineCalc.
Ogni calcolatore segue sempre gli stessi passaggi standardizzati.

---

## 📋 CHECKLIST COMPLETA

- [ ] **Step 1**: Analisi calcolatore di riferimento
- [ ] **Step 2**: Creare file JavaScript del calcolatore
- [ ] **Step 3**: Creare file di configurazione campi
- [ ] **Step 4**: Registrare in `calculators-config.json`
- [ ] **Step 5**: Aggiungere traduzioni (5 lingue)
- [ ] **Step 6**: Aggiungere formula nella pagina formule
- [ ] **Step 7**: Test funzionalità

---

## STEP 1: Analisi Calcolatore di Riferimento

Prima di scrivere codice, analizza il calcolatore di riferimento.

### Raccogli queste informazioni:

**Input richiesti:**
- [ ] Quali campi di input ha?
- [ ] Quali sono i nomi dei campi?
- [ ] Quali sono i range validi (min/max)?
- [ ] Quali sono le unità di misura?

**Formule:**
- [ ] Qual è la formula matematica utilizzata?
- [ ] Ci sono costanti o fattori di conversione?
- [ ] Ci sono validazioni speciali?

**Output:**
- [ ] Quali risultati vengono mostrati?
- [ ] Quali sono le unità di misura dei risultati?
- [ ] Quanti decimali per ogni risultato?

**Note/Warning:**
- [ ] Ci sono note informative da mostrare?
- [ ] Ci sono warning o avvisi importanti?

**Documentazione:**
- [ ] Copia il testo esatto dal sito di riferimento per le traduzioni
- [ ] Salva screenshots se necessario

---

## STEP 2: Creare File JavaScript Calcolatore

**File:** `js/calculators/{calculator_id}.js`

### Template Standard

```javascript
/* WineCalc - {Calculator Name} Calculator */

/**
 * {Descrizione del calcolatore}
 *
 * @param {Object} data - Input data
 * @param {number} data.field1 - Descrizione campo 1
 * @param {number} data.field2 - Descrizione campo 2
 * @returns {Object} Calculation results
 */
function calculate_{calculator_id}(data) {
    // 1. DESTRUTTURAZIONE INPUT
    const { field1, field2 } = data;

    // 2. VALIDAZIONE INPUT
    if (!field1 || field1 <= 0) {
        throw new Error(WineCalcI18n.t('errors.field1Required'));
    }

    if (!field2 || field2 < 0) {
        throw new Error(WineCalcI18n.t('errors.field2Required'));
    }

    // 3. CALCOLO
    // Formula: {Scrivi la formula qui}
    const result1 = (field1 * field2) / 1000;
    const result2 = field1 + field2;

    // 4. RITORNO RISULTATI CON ARROTONDAMENTO
    return {
        result1: Math.round(result1 * 1000) / 1000,  // 3 decimali
        result2: Math.round(result2 * 10) / 10        // 1 decimale
    };
}

// 5. ESPORTAZIONE SU WINDOW
window.calculate_{calculator_id} = calculate_{calculator_id};
```

### Regole Importanti

1. **Nome funzione**: DEVE essere `calculate_{calculator_id}` dove {calculator_id} è l'ID dal config con i trattini sostituiti da underscore
   - Esempio: ID "ascorbic-acid" → funzione `calculate_ascorbic_acid`
   - Esempio: ID "acid" → funzione `calculate_acid`
   - **ATTENZIONE**: Usare underscore `_`, NON camelCase!
2. **Input**: Sempre un oggetto `data`
3. **Validazione**: Usa `WineCalcI18n.t('errors.XXX')` per messaggi tradotti
4. **Output**: Oggetto semplice con i risultati
5. **Arrotondamento**:
   - 3 decimali: `Math.round(x * 1000) / 1000`
   - 2 decimali: `Math.round(x * 100) / 100`
   - 1 decimale: `Math.round(x * 10) / 10`
6. **Export**: Sempre su `window.calculate_{calculator_id}` (con underscore!)
7. **Ordine campi**: Rispettare l'ordine dei campi del calcolatore di riferimento

### Esempio Reale: Acid Addition

```javascript
function calculate_acid(data) {
    const { additionRate, volume } = data;

    // Validation
    if (!volume || volume <= 0) {
        throw new Error(WineCalcI18n.t('errors.volumeRequired'));
    }

    if (!additionRate || additionRate <= 0) {
        throw new Error(WineCalcI18n.t('errors.positiveValue'));
    }

    // Formula: Amount (kg) = (Addition Rate g/L × Volume L) / 1000
    const amountKg = (additionRate * volume) / 1000;
    const amountG = additionRate * volume;

    return {
        amountKg: Math.round(amountKg * 1000) / 1000,
        amountG: Math.round(amountG * 10) / 10,
        additionRate: additionRate,
        volume: volume
    };
}

window.calculate_acid = calculate_acid;
```

---

## STEP 3: Creare File Configurazione Campi

**File:** `js/calculators-fields/{calculator_id}.json`

### Template Standard

```json
{
  "info": true,
  "alertType": "info",
  "fields": [
    {
      "id": "field1",
      "type": "number",
      "label": "field1",
      "min": 0,
      "step": 0.1,
      "placeholder": "100",
      "required": true
    },
    {
      "id": "field2",
      "type": "number",
      "label": "field2",
      "min": 0,
      "step": 0.01,
      "placeholder": "10.5",
      "required": true
    }
  ],
  "results": {
    "order": ["result1", "result2"],
    "units": {
      "result1": "kg",
      "result2": "g/L"
    },
    "decimals": {
      "result1": 3,
      "result2": 1
    },
    "formula": true
  }
}
```

### Campi Disponibili

**Tipi di input supportati:**
- `"number"` - Input numerico
- `"select"` - Dropdown (richiede opzione `options`)
- `"text"` - Input testo

**Attributi campo:**
- `id` (required): ID univoco campo
- `type` (required): Tipo input
- `label` (required): Chiave traduzione (usa solo il nome del campo)
- `min`: Valore minimo (per number)
- `max`: Valore massimo (per number)
- `step`: Incremento (0.1, 0.01, ecc.)
- `placeholder`: Esempio valore
- `required`: true/false
- `options`: Array di opzioni (solo per select)

**Configurazione risultati:**
- `order`: Ordine di visualizzazione risultati
- `units`: Unità di misura per ogni risultato
- `decimals`: Numero decimali per ogni risultato
- `formula`: true per mostrare il link alla formula

### Esempio Reale: Acid Addition

```json
{
  "info": true,
  "alertType": "info",
  "fields": [
    {
      "id": "additionRate",
      "type": "number",
      "label": "additionRate",
      "min": 0,
      "step": 0.1,
      "placeholder": "10",
      "required": true
    },
    {
      "id": "volume",
      "type": "number",
      "label": "volume",
      "min": 0,
      "step": 0.1,
      "placeholder": "1",
      "required": true
    }
  ],
  "results": {
    "order": ["amountKg", "amountG"],
    "units": {
      "amountKg": "kg",
      "amountG": "g"
    },
    "decimals": {
      "amountKg": 3,
      "amountG": 1
    },
    "formula": true
  }
}
```

---

## STEP 4: Registrare in calculators-config.json

**File:** `calculators-config.json`

Aggiungi una nuova entry nell'array `calculators`:

```json
{
  "id": "{calculator_id}",
  "enabled": true,
  "category": "chemical",
  "icon": "bi-droplet",
  "jsFile": "js/calculators/{calculator_id}.js",
  "priority": 10
}
```

### Parametri

- **id**: Identificativo univoco (lowercase, no spazi)
- **enabled**: `true` per mostrare, `false` per nascondere
- **category**:
  - `"chemical"` - Analisi chimiche
  - `"specialized"` - Calcoli specializzati
  - `"reference"` - Riferimenti e conversioni
  - `"sensory"` - Analisi sensoriali
  - `"additional"` - Altri calcolatori
- **icon**: Icona Bootstrap Icons (es: `"bi-droplet"`, `"bi-calculator"`)
  - Vedi: https://icons.getbootstrap.com/
- **jsFile**: Percorso file JavaScript
- **priority**: Ordine visualizzazione (numero più basso = prima)

### Esempio Completo

```json
{
  "calculators": [
    {
      "id": "acid",
      "enabled": true,
      "category": "chemical",
      "icon": "bi-droplet",
      "jsFile": "js/calculators/acid.js",
      "priority": 2
    },
    {
      "id": "ascorbic-acid",
      "enabled": true,
      "category": "chemical",
      "icon": "bi-shield-check",
      "jsFile": "js/calculators/ascorbic-acid.js",
      "priority": 3
    }
  ]
}
```

**NOTA IMPORTANTE:** L'ID può contenere trattini (es: "ascorbic-acid"). Il sistema converte automaticamente i trattini in underscore quando cerca la funzione JavaScript (es: "ascorbic-acid" → `calculate_ascorbic_acid`).

---

## STEP 5: Aggiungere Traduzioni (5 LINGUE)

WineCalc supporta 5 lingue: **IT, EN, FR, ES, DE**

### File da modificare:
- `locales/it.json`
- `locales/en.json`
- `locales/fr.json`
- `locales/es.json`
- `locales/de.json`

### Struttura JSON per ogni lingua

```json
{
  "calculators": {
    "{calculator_id}": {
      "title": "Titolo Calcolatore",
      "description": "Breve descrizione per la card homepage",
      "field1": "Label Campo 1",
      "field2": "Label Campo 2",
      "results": {
        "result1": "Label Risultato 1",
        "result2": "Label Risultato 2"
      },
      "info": "Testo informativo mostrato nel banner del calcolatore (opzionale)",
      "formula": "Descrizione formula utilizzata"
    }
  }
}
```

### Esempio: Acid Addition (IT)

```json
{
  "calculators": {
    "acid": {
      "title": "Aggiunta Acido",
      "description": "Calcola la quantità di acido tartarico da aggiungere",
      "additionRate": "Tasso di aggiunta (g/L)",
      "volume": "Volume (L)",
      "results": {
        "amountKg": "Quantità di acido da aggiungere (kg)",
        "amountG": "Quantità di acido da aggiungere (g)"
      },
      "info": "Utilizza questo calcolatore per determinare la quantità di acido tartarico necessaria per aumentare l'acidità del vino.",
      "formula": "Quantità (kg) = (Tasso aggiunta g/L × Volume L) / 1000"
    }
  }
}
```

### Note Importanti:

1. **Label campi**: Devono corrispondere agli `id` in `calculators-fields/{id}.json`
2. **Label risultati**: Devono corrispondere alle chiavi ritornate dalla funzione `calculate_`
3. **Traduzioni accurate**: Chiedi aiuto per FR, ES, DE se necessario

---

## STEP 6: Aggiungere Formula nella Pagina Formule

La pagina delle formule (`formulas.html`) documenta le formule matematiche utilizzate dai calcolatori.

### 6.1: Creare Template HTML Formula

**File:** `formulas/{calculator_id}.html`

```html
<!-- Description -->
<p class="text-muted" data-i18n="calculators.{calculator_id}.description">
    Descrizione breve del calcolatore
</p>

<!-- Formula -->
<div class="alert alert-light border mb-3">
    <h6 class="mb-3">
        <i class="bi bi-calculator me-2"></i>
        <span id="{calculator_id}FormulaDescription"></span>
    </h6>
    <div id="{calculator_id}FormulaSteps"></div>
</div>

<!-- Inputs -->
<h6 class="mt-4"><i class="bi bi-input-cursor me-2"></i><span data-i18n="formulas.inputs">Parametri di Input</span></h6>
<ul>
    <li>
        <strong id="{calculator_id}InputField1"></strong>
        <span data-i18n="formulas.{calculator_id}.field1Desc">- Descrizione campo 1</span>
    </li>
    <li>
        <strong id="{calculator_id}InputField2"></strong>
        <span data-i18n="formulas.{calculator_id}.field2Desc">- Descrizione campo 2</span>
    </li>
</ul>

<!-- Outputs -->
<h6 class="mt-4"><i class="bi bi-calculator-fill me-2"></i><span data-i18n="formulas.outputs">Risultati</span></h6>
<ul>
    <li>
        <strong id="{calculator_id}OutputResult1"></strong>
    </li>
    <li>
        <strong id="{calculator_id}OutputResult2"></strong>
    </li>
</ul>

<!-- Notes -->
<div class="alert alert-info mt-4">
    <h6><i class="bi bi-info-circle me-2"></i><span data-i18n="formulas.notes">Note Importanti</span></h6>
    <p class="mb-0" id="{calculator_id}InfoNote"></p>
</div>

```

**Note importanti:**
- Sostituisci `{calculator_id}` con l'ID effettivo (es: "ascorbic-acid")
- Gli ID degli elementi devono seguire il pattern: `{calculator_id}InputNomeCampo`, `{calculator_id}OutputNomeRisultato`
- I nomi dei campi negli ID devono usare PascalCase (es: AdditionRate, Volume)
- Usa `alert-info` per note generiche, `alert-warning` per avvisi importanti

### 6.2: Aggiungere Sezione in formulas.html

Apri `formulas.html` e aggiungi una nuova sezione dopo le altre formule:

```html
<!-- {Calculator Name} Formula -->
<div class="col-12">
    <div class="card shadow-sm">
        <div class="card-header bg-wine text-white" style="cursor: pointer;"
             data-bs-toggle="collapse" data-bs-target="#{calculator_id}Formula"
             aria-expanded="false" aria-controls="{calculator_id}Formula">
            <h4 class="mb-0 d-flex justify-content-between align-items-center">
                <span>
                    <i class="bi bi-{icon} me-2"></i>
                    <span data-i18n="calculators.{calculator_id}.title">Titolo Calcolatore</span>
                </span>
                <i class="bi bi-chevron-down"></i>
            </h4>
        </div>
        <div class="collapse" id="{calculator_id}Formula">
            <div class="card-body" id="{calculator_id}FormulaContent">
                <!-- Content will be loaded dynamically -->
            </div>
        </div>
    </div>
</div>
```

**IMPORTANTE:** L'ID deve essere `{calculator_id}Formula` (con i trattini, non camelCase). Il sistema rimuoverà automaticamente "Formula" per ottenere l'ID del calcolatore.

### 6.3: Aggiungere Traduzioni Descrizioni Campi

Per ogni lingua, aggiungi le descrizioni dei campi input in `locales/{lang}/common.json`:

```json
{
  "formulas": {
    "{calculator_id}": {
      "field1Desc": "- Descrizione campo 1",
      "field2Desc": "- Descrizione campo 2"
    }
  }
}
```

**Esempio per ascorbic-acid (IT):**
```json
{
  "formulas": {
    "ascorbic-acid": {
      "additionRateDesc": "- Quantità desiderata di acido ascorbico da aggiungere per litro di vino",
      "volumeDesc": "- Volume totale di vino da trattare"
    }
  }
}
```

### 6.4: Verifica

1. Apri `http://localhost:8000/formulas.html`
2. Trova la sezione del tuo calcolatore
3. Clicca per espandere
4. Verifica che:
   - La formula venga caricata correttamente
   - Gli step della formula siano visualizzati
   - I campi input/output abbiano le label tradotte
   - Le note informative siano presenti

**Il sistema è automatico!** Non serve modificare lo script JavaScript in `formulas.html` - il codice è generico e funziona per tutti i calcolatori seguendo le convenzioni di naming.

---

## STEP 7: Test Funzionalità

### Checklist Test

- [ ] **Avvio Server Locale**
  ```bash
  python3 -m http.server 8000
  # Apri http://localhost:8000
  ```

- [ ] **Visualizzazione Card**
  - [ ] La card del calcolatore appare nella homepage
  - [ ] L'icona è corretta
  - [ ] La descrizione è leggibile
  - [ ] La categoria è corretta

- [ ] **Apertura Modal**
  - [ ] Clic sulla card apre il modal
  - [ ] Il titolo è corretto
  - [ ] Il form viene generato correttamente

- [ ] **Form Validation**
  - [ ] I campi required funzionano
  - [ ] I valori min/max funzionano
  - [ ] Gli step incrementano correttamente

- [ ] **Calcolo**
  - [ ] Inserisci valori di test
  - [ ] Clicca "Calcola"
  - [ ] Verifica che i risultati siano corretti
  - [ ] Verifica gli arrotondamenti
  - [ ] Verifica le unità di misura

- [ ] **Errori**
  - [ ] Prova valori negativi/zero
  - [ ] Verifica messaggi errore tradotti
  - [ ] Verifica che non crashino l'app

- [ ] **Multilingua**
  - [ ] Cambia lingua in IT, EN, FR, ES, DE
  - [ ] Verifica tutte le traduzioni
  - [ ] Controlla che non ci siano chiavi mancanti (es: `calculators.acid.title`)

- [ ] **Responsive**
  - [ ] Testa su desktop
  - [ ] Testa su mobile/tablet
  - [ ] Verifica layout modal

- [ ] **Console Errors**
  - [ ] Apri DevTools → Console
  - [ ] Non devono esserci errori JavaScript
  - [ ] Non devono esserci warning i18next (missing keys)

### Valori di Test Raccomandati

Usa sempre valori di esempio dal sito di riferimento per validare i risultati.

**Esempio Acid Addition:**
- Input: additionRate = 1.5 g/L, volume = 100 L
- Output atteso: amountKg = 0.15 kg, amountG = 150 g

---

## 🎯 ESEMPIO COMPLETO: Ascorbic Acid Calculator

Seguiamo tutti i passaggi per aggiungere il calcolatore "Ascorbic Acid".

### STEP 1: Analisi Calcolatore
```
Input:
- Volume (L)
- Addition rate (mg/L)

Formula:
- Amount (g) = (Volume × Addition Rate) / 1000

Output:
- Amount in grams
```

### STEP 2: File JavaScript

**File:** `js/calculators/ascorbic-acid.js`

```javascript
/* WineCalc - Ascorbic Acid Addition Calculator */

/**
 * Calculate ascorbic acid addition for wine preservation
 *
 * @param {Object} data - Input data
 * @param {number} data.volume - Volume of wine in liters
 * @param {number} data.additionRate - Desired addition rate in mg/L
 * @returns {Object} Calculation results
 */
function calculate_ascorbic_acid(data) {
    const { volume, additionRate } = data;

    // Validation
    if (!volume || volume <= 0) {
        throw new Error(WineCalcI18n.t('errors.volumeRequired'));
    }

    if (!additionRate || additionRate <= 0) {
        throw new Error(WineCalcI18n.t('errors.positiveValue'));
    }

    // Formula: Amount (g) = (Volume L × Addition Rate mg/L) / 1000
    const amountG = (volume * additionRate) / 1000;
    const amountKg = amountG / 1000;

    return {
        amountG: Math.round(amountG * 100) / 100,      // 2 decimali
        amountKg: Math.round(amountKg * 1000) / 1000   // 3 decimali
    };
}

window.calculate_ascorbicAcid = calculate_ascorbicAcid;
```

### STEP 3: File Configurazione Campi

**File:** `js/calculators-fields/ascorbic-acid.json`

```json
{
  "info": true,
  "alertType": "warning",
  "fields": [
    {
      "id": "volume",
      "type": "number",
      "label": "volume",
      "min": 0,
      "step": 0.1,
      "placeholder": "100",
      "required": true
    },
    {
      "id": "additionRate",
      "type": "number",
      "label": "additionRate",
      "min": 0,
      "step": 1,
      "placeholder": "50",
      "required": true
    }
  ],
  "results": {
    "order": ["amountG", "amountKg"],
    "units": {
      "amountG": "g",
      "amountKg": "kg"
    },
    "decimals": {
      "amountG": 2,
      "amountKg": 3
    },
    "formula": true
  }
}
```

### STEP 4: Registrazione Config

**File:** `calculators-config.json`

```json
{
  "calculators": [
    {
      "id": "acid",
      "enabled": true,
      "category": "chemical",
      "icon": "bi-droplet",
      "jsFile": "js/calculators/acid.js",
      "priority": 2
    },
    {
      "id": "ascorbic-acid",
      "enabled": true,
      "category": "chemical",
      "icon": "bi-shield-check",
      "jsFile": "js/calculators/ascorbic-acid.js",
      "priority": 3
    }
  ]
}
```

### STEP 5: Traduzioni

**File:** `locales/it.json`

```json
{
  "calculators": {
    "ascorbic-acid": {
      "title": "Acido Ascorbico",
      "description": "Calcola l'aggiunta di acido ascorbico per la conservazione del vino",
      "volume": "Volume (L)",
      "additionRate": "Tasso di aggiunta (mg/L)",
      "results": {
        "amountG": "Quantità di acido ascorbico (g)",
        "amountKg": "Quantità di acido ascorbico (kg)"
      },
      "info": "L'acido ascorbico deve essere utilizzato insieme al solfito. Dosaggio tipico: 50-100 mg/L.",
      "formula": "Quantità (g) = (Volume L × Tasso mg/L) / 1000"
    }
  }
}
```

**File:** `locales/en.json`

```json
{
  "calculators": {
    "ascorbic-acid": {
      "title": "Ascorbic Acid",
      "description": "Calculate ascorbic acid addition for wine preservation",
      "volume": "Volume (L)",
      "additionRate": "Addition rate (mg/L)",
      "results": {
        "amountG": "Amount of ascorbic acid (g)",
        "amountKg": "Amount of ascorbic acid (kg)"
      },
      "info": "Ascorbic acid should be used in conjunction with sulfite. Typical dosage: 50-100 mg/L.",
      "formula": "Amount (g) = (Volume L × Rate mg/L) / 1000"
    }
  }
}
```

*(Ripeti per FR, ES, DE)*

### STEP 6: Test

```bash
# Avvia server
python3 -m http.server 8000

# Test Values:
# Volume: 100 L
# Addition Rate: 50 mg/L
# Expected Result: 5 g (0.005 kg)
```

---

## ✅ CHECKLIST FINALE

Prima di considerare completo un calcolatore:

- [ ] File JavaScript creato e funzionante
- [ ] File configurazione campi creato
- [ ] Registrato in `calculators-config.json`
- [ ] Traduzioni aggiunte per TUTTE le 5 lingue
- [ ] Testato con valori di riferimento
- [ ] Validazione input funzionante
- [ ] Risultati arrotondati correttamente
- [ ] Nessun errore in console
- [ ] Responsive su mobile
- [ ] Commit git con messaggio descrittivo

---

## 📚 RISORSE

- **Bootstrap Icons**: https://icons.getbootstrap.com/
- **Architettura dettagliata**: Vedi `ARCHITECTURE.md`
- **Esempio completo**: Vedi `js/calculators/acid.js`

---

**Ultimo aggiornamento:** 2025-01-27
**Versione:** 1.0
