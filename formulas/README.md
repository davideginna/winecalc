# Formulas Directory

Questa directory contiene i template HTML per le formule di ogni calcolatore.

## Struttura

Ogni calcolatore ha il proprio file HTML con il contenuto specifico della formula:

```
formulas/
├── acid.html           # Formula per Acid Addition
├── so2.html            # Formula per SO2 (da aggiungere)
├── bentonite.html      # Formula per Bentonite (da aggiungere)
└── ...
```

## Come Funziona

1. **Caricamento Dinamico**: Il contenuto viene caricato solo quando l'utente apre il collapse nella pagina `formulas.html`
2. **Traduzioni**: Le traduzioni vengono caricate automaticamente prima di renderizzare il contenuto
3. **Cache**: Ogni formula viene caricata solo una volta per sessione
4. **Cambio Lingua**: Al cambio lingua, solo i collapse aperti vengono ricaricati

## Aggiungere una Nuova Formula

### 1. Crea il File HTML

Crea `formulas/[calculator-id].html` con la struttura della formula:

```html
<!-- Description -->
<p class="text-muted" data-i18n="calculators.[calculator-id].description">
    Descrizione del calcolatore
</p>

<!-- Formula -->
<div class="alert alert-light border mb-3">
    <h6 class="mb-3">
        <i class="bi bi-calculator me-2"></i>
        <span id="[calculator-id]FormulaDescription"></span>
    </h6>
    <div id="[calculator-id]FormulaSteps"></div>
</div>

<!-- Inputs -->
<h6 class="mt-4"><i class="bi bi-input-cursor me-2"></i><span data-i18n="formulas.inputs">Parametri di Input</span></h6>
<ul>
    <li>
        <strong id="[calculator-id]Input[Field1]"></strong>
        <span data-i18n="formulas.[calculator-id].field1Desc">Descrizione campo</span>
    </li>
    <!-- Add more inputs -->
</ul>

<!-- Outputs -->
<h6 class="mt-4"><i class="bi bi-calculator-fill me-2"></i><span data-i18n="formulas.outputs">Risultati</span></h6>
<ul>
    <li>
        <strong id="[calculator-id]Output[Result1]"></strong>
    </li>
    <!-- Add more outputs -->
</ul>

<!-- Notes (opzionale) -->
<div class="alert alert-info mt-4">
    <h6><i class="bi bi-info-circle me-2"></i><span data-i18n="formulas.notes">Note Importanti</span></h6>
    <p class="mb-0" id="[calculator-id]InfoNote"></p>
</div>

<!-- Source -->
<p class="text-muted small mt-3">
    <i class="bi bi-link-45deg"></i>
    <span data-i18n="formulas.source">Fonte</span>:
    <a href="https://..." target="_blank" rel="noopener">
        AWRI - Australian Wine Research Institute
    </a>
</p>
```

### 2. Aggiungi il Collapse in formulas.html

In `formulas.html`, aggiungi un nuovo collapse nella sezione "Formulas List":

```html
<div class="col-12">
    <div class="card shadow-sm">
        <div class="card-header bg-wine text-white" style="cursor: pointer;"
             data-bs-toggle="collapse" data-bs-target="#[calculator-id]Formula"
             aria-expanded="false" aria-controls="[calculator-id]Formula">
            <h4 class="mb-0 d-flex justify-content-between align-items-center">
                <span>
                    <i class="bi bi-[icon] me-2"></i>
                    <span data-i18n="calculators.[calculator-id].title">Nome Calcolatore</span>
                </span>
                <i class="bi bi-chevron-down"></i>
            </h4>
        </div>
        <div class="collapse" id="[calculator-id]Formula">
            <div class="card-body" id="[calculator-id]FormulaContent">
                <!-- Content will be loaded dynamically -->
            </div>
        </div>
    </div>
</div>
```

### 3. Aggiungi la Logica di Traduzione

In `formulas.html`, nella funzione `translateFormulaContent()`, aggiungi un case specifico per il tuo calcolatore:

```javascript
// Special handling for [calculator-id]
if (calculatorId === '[calculator-id]') {
    // Formula description and steps
    const formulaData = t('formula', { ns: '[calculator-id]', returnObjects: true, defaultValue: null });
    if (formulaData) {
        const descEl = document.getElementById('[calculator-id]FormulaDescription');
        if (descEl) descEl.textContent = formulaData.description || '';

        const stepsContainer = document.getElementById('[calculator-id]FormulaSteps');
        if (stepsContainer && formulaData.steps) {
            stepsContainer.innerHTML = formulaData.steps.map((step, i) => `
                <div class="font-monospace small mb-1 p-2 bg-light rounded">${i + 1}. ${step}</div>
            `).join('');
        }
    }

    // Input labels
    const field1El = document.getElementById('[calculator-id]Input[Field1]');
    if (field1El) field1El.textContent = t('[field1]', { ns: '[calculator-id]' });

    // Output labels
    const result1El = document.getElementById('[calculator-id]Output[Result1]');
    if (result1El) result1El.textContent = t('results.[result1]', { ns: '[calculator-id]' });

    // Info note (if exists)
    const infoEl = document.getElementById('[calculator-id]InfoNote');
    if (infoEl) infoEl.textContent = t('info', { ns: '[calculator-id]' });
}
```

### 4. Aggiungi Traduzioni (se necessario)

In `locales/[lang]/common.json`, aggiungi eventuali descrizioni aggiuntive in `formulas.[calculator-id]`:

```json
"formulas": {
  "[calculator-id]": {
    "field1Desc": "- Descrizione del campo 1",
    "field2Desc": "- Descrizione del campo 2"
  }
}
```

## Note Importanti

- **Personalizzazione**: Ogni formula può essere completamente diversa - non usare template generici
- **Performance**: Il caricamento lazy mantiene leggera la pagina anche con 33+ calcolatori
- **Traduzioni**: Ricorda di aggiungere traduzioni in tutte e 5 le lingue (IT, EN, FR, ES, DE)
- **ID Univoci**: Usa ID univoci per ogni elemento per evitare conflitti
- **Icone Bootstrap**: Usa icone appropriate da [Bootstrap Icons](https://icons.getbootstrap.com/)

## Esempio Completo

Vedi `formulas/acid.html` per un esempio completo e funzionante.
