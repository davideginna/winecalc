# 🍷 WineCalc - Calcolatori Enologici Professionali

Applicazione web mobile-first per calcoli enologici professionali, ispirata ai calcolatori AWRI (Australian Wine Research Institute).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-purple.svg)](https://getbootstrap.com/)

## 🌟 Caratteristiche

- ✅ **34+ Calcolatori Enologici** - Tutti i calcolatori disponibili sul sito AWRI
- 🌍 **Multilingua** - Supporto completo per IT, EN, FR, ES, DE
- 📱 **Mobile-First** - Design ottimizzato per smartphone e tablet
- 🎨 **Interfaccia Moderna** - Bootstrap 5 con tema personalizzato ispirato al vino
- ⚡ **Veloce e Leggero** - Nessuna dipendenza backend, solo HTML/CSS/JS
- 🔧 **Open Source** - Codice libero e modificabile

## 📋 Calcolatori Disponibili

### Aggiunte Chimiche (15)
- ✅ Anidride Solforosa (SO2) - **Implementato**
- ✅ Aggiunta Acidi - **Implementato**
- ✅ Bentonite
- Carbone
- Solfato di Rame
- Cremor Tartaro
- Deacidificazione
- Fosfato Diammonico (DAP)
- Perossido di Idrogeno
- Isinglass
- Metabisolfito di Potassio (PMS)
- PVPP
- Acido Sorbico
- Tannini

### Calcoli Specializzati (7)
- ✅ Fortificazione - **Implementato**
- Prova Ferrocianuro
- Prova di Chiarifica
- Aggiunta Mosto Concentrato (GJC)
- Micro-ossigenazione
- SO2 Molecolare
- ✅ Aggiunta Acqua - **Implementato**

### Strumenti di Riferimento (4)
- ✅ Conversioni Generali - **Implementato**
- Interconversione Unità di Acidità
- Soluzioni Stock Laboratorio
- Soluzioni Stock Cantina

### Analisi Sensoriale (5)
- Test Preferenza Accoppiata
- Analisi Same/Different
- Test Duo-trio
- Test Confronto Accoppiato
- Test Triangolare

### Risorse Aggiuntive (3)
- Calcolatore Proporzione Metanolo
- Calcolatore Unità Alcoliche Standard
- Calcolatore Refrigerazione Cantina

## 🚀 Avvio Rapido

### Opzione 1: Apertura Diretta (Semplice)

```bash
# Apri semplicemente index.html nel browser
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

**Nota:** Alcuni browser potrebbero bloccare il caricamento delle traduzioni per motivi di sicurezza (CORS). Se riscontri problemi, usa una delle opzioni seguenti.

### Opzione 2: Python HTTP Server (Consigliato)

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Apri il browser su:
# http://localhost:8000
```

### Opzione 3: Node.js HTTP Server

```bash
# Installa serve globalmente (solo la prima volta)
npm install -g serve

# Avvia il server
serve .

# Oppure usa npx (senza installazione)
npx serve .
```

### Opzione 4: VS Code Live Server

1. Installa l'estensione "Live Server" in VS Code
2. Apri la cartella del progetto in VS Code
3. Click destro su `index.html` → "Open with Live Server"

## 📱 Accesso da Smartphone

Per testare l'app dal tuo smartphone sulla rete locale:

1. Avvia un server locale (es. `python3 -m http.server 8000`)
2. Trova l'indirizzo IP del tuo computer:
   ```bash
   # Linux/Mac
   ifconfig | grep inet

   # Windows
   ipconfig
   ```
3. Sul tuo smartphone, apri il browser e vai a:
   ```
   http://[IP_TUO_COMPUTER]:8000
   ```
   Esempio: `http://192.168.1.100:8000`

## 🌐 Deployment su GitHub Pages

### 1. Crea un Repository su GitHub

```bash
# Inizializza git nella cartella del progetto
git init

# Aggiungi tutti i file
git add .

# Commit iniziale
git commit -m "Initial commit: WineCalc application"

# Crea repository su GitHub (manualmente o via CLI)
# Poi collega il repository remoto
git remote add origin https://github.com/TUO_USERNAME/winecalc.git

# Push del codice
git branch -M main
git push -u origin main
```

### 2. Attiva GitHub Pages

1. Vai su GitHub.com → Il tuo repository
2. Clicca su **Settings**
3. Scorri fino alla sezione **Pages**
4. In **Source** seleziona:
   - Branch: `main`
   - Folder: `/ (root)`
5. Clicca **Save**
6. Dopo qualche minuto, l'app sarà disponibile su:
   ```
   https://TUO_USERNAME.github.io/winecalc
   ```

### 3. Aggiorna il Link GitHub nel Footer

Modifica `index.html` alla riga del footer:

```html
<a href="https://github.com/TUO_USERNAME/winecalc" class="text-white text-decoration-none">
    Vedi su GitHub
</a>
```

## 🛠️ Struttura del Progetto

```
winecalc/
├── index.html                    # Homepage principale
├── README.md                     # Questo file
├── ARCHITECTURE.md               # 📐 Documentazione architettura
├── run.sh                        # Script avvio server sviluppo
│
├── calculators-config.json       # Configurazione calcolatori
│
├── css/
│   ├── theme.css                 # Variabili tema e colori
│   └── styles.css                # Stili personalizzati
│
├── js/
│   ├── main.js                   # Entry point principale
│   ├── i18n.js                   # Sistema internazionalizzazione
│   ├── utils.js                  # Funzioni utility
│   ├── theme-manager.js          # Gestione tema scuro/chiaro
│   ├── settings-ui.js            # UI impostazioni
│   │
│   ├── modules/                  # Moduli core (ES6)
│   │   ├── app-state.js          # State management
│   │   ├── calculator-loader.js  # Caricamento calcolatori
│   │   ├── calculator-manager.js # Gestione lifecycle
│   │   ├── template-generator.js # Generazione form dinamica
│   │   ├── form-handler.js       # Gestione submit form
│   │   └── results-renderer.js   # Rendering risultati
│   │
│   ├── calculators/              # Moduli calcolatori
│   │   ├── acid.js               # Aggiunta acido
│   │   ├── so2.js                # Anidride solforosa
│   │   ├── bentonite.js          # Bentonite
│   │   ├── fortification.js      # Fortificazione
│   │   └── ...                   # Altri calcolatori
│   │
│   └── calculators-fields/       # Configurazione campi form (JSON)
│       ├── acid.json             # Campi per calcolatore acid
│       ├── so2.json              # Campi per calcolatore SO2
│       ├── bentonite.json        # Campi per calcolatore bentonite
│       └── ...                   # Un file per ogni calcolatore
│
├── locales/                      # File traduzioni
│   ├── it.json                   # Italiano
│   ├── en.json                   # Inglese
│   ├── fr.json                   # Francese
│   ├── es.json                   # Spagnolo
│   └── de.json                   # Tedesco
│
└── assets/
    └── img/                      # Immagini e screenshots
```

## 🔧 Tecnologie Utilizzate

- **HTML5** - Struttura semantica
- **CSS3** - Stili moderni con variabili CSS
- **JavaScript ES6+** - Logica applicazione con moduli ES6
- **Bootstrap 5.3.3** - Framework CSS responsive
- **Bootstrap Icons** - Icone
- **i18next** - Gestione multilingua

## 🏗️ Architettura e Flusso Dati

WineCalc utilizza un'architettura **modulare basata su configurazione JSON** che permette di aggiungere nuovi calcolatori facilmente senza modificare il codice core.

### Flusso Dati Semplificato

```
USER compila form
    ↓
FormHandler raccoglie dati → { volume: 100, additionRate: 10 }
    ↓
Converte stringhe in numeri → { volume: 100, additionRate: 10 }
    ↓
Chiama window.calculate_acid(data)
    ↓
Funzione esegue calcolo → { amountKg: 0.01, amountG: 10 }
    ↓
ResultsRenderer mostra risultati
    ↓
USER vede "0.01 kg" e "10 g"
```

### Componenti Principali

- **TemplateGenerator**: Genera form HTML da `calculators-fields-config.json`
- **FormHandler**: Gestisce submit, raccoglie dati, chiama calcolatore
- **Funzione Calcolatore**: Riceve dati, esegue calcolo, ritorna risultati
- **ResultsRenderer**: Prende risultati, aggiunge traduzioni e unità, mostra all'utente

📚 **Documentazione Completa**: Vedi [ARCHITECTURE.md](ARCHITECTURE.md) per:
- Flusso dati dettagliato con diagrammi
- Spiegazione di ogni modulo
- Esempi di codice passo-passo
- Debug e troubleshooting

## 🧮 Come Funzionano i Calcolatori

### Esempio: Calcolatore SO2

```javascript
// Formula utilizzata:
// Quantità solfito = (Volume × Differenza SO2) / (Fattore × 1000)

// Fattori di conversione:
// - Metabisolfito di Potassio: 0.57 (57% SO2)
// - Metabisolfito di Sodio: 0.67 (67% SO2)
// - Anidride Solforosa Gassosa: 1.0 (100% SO2)
```

### Esempio: Calcolatore Fortificazione

```javascript
// Formula Pearson Square:
// Volume spirito = Volume vino × (Alcol target - Alcol attuale) / (Alcol spirito - Alcol target)
```

## ➕ Aggiungere un Nuovo Calcolatore

Il sistema WineCalc utilizza un approccio modulare e basato su configurazione per facilitare l'aggiunta di nuovi calcolatori. Segui questi 4 passaggi:

### 1. Crea il Modulo JavaScript del Calcolatore

Crea un file `js/calculators/nome-calcolatore.js` con una funzione di calcolo:

```javascript
/* WineCalc - Nome Calcolatore */

/**
 * Descrizione del calcolatore
 * Basato su: [link fonte AWRI o altra]
 *
 * @param {Object} data - Dati di input dal form
 * @param {number} data.campo1 - Descrizione campo 1
 * @param {number} data.campo2 - Descrizione campo 2
 * @returns {Object} Risultati del calcolo
 */
function calculate_nome_calcolatore(data) {
    const { campo1, campo2 } = data;

    // Validazione input
    if (!campo1 || campo1 <= 0) {
        throw new Error(WineCalcI18n.t('errors.positiveValue'));
    }

    // Formula: [descrizione formula]
    const risultato = campo1 * campo2;

    // Ritorna i risultati
    return {
        risultato: Math.round(risultato * 100) / 100,
        campo1: campo1,
        campo2: campo2
    };
}

// Esporta la funzione
window.calculate_nome_calcolatore = calculate_nome_calcolatore;
```

### 2. Registra il Calcolatore in `calculators-config.json`

Aggiungi una entry nel file di configurazione:

```json
{
  "calculators": [
    {
      "id": "nome_calcolatore",
      "enabled": true,
      "category": "chemical",
      "icon": "bi-flask",
      "jsFile": "js/calculators/nome-calcolatore.js",
      "priority": 10
    }
  ]
}
```

**Parametri:**
- `id`: identificatore univoco (snake_case)
- `enabled`: `true` per mostrare, `false` per nascondere
- `category`: `chemical`, `specialized`, `reference`, `sensory`, `additional`
- `icon`: classe icona Bootstrap Icons (vedi [bootstrap-icons](https://icons.getbootstrap.com/))
- `jsFile`: percorso al file JavaScript
- `priority`: ordine di visualizzazione (numeri più bassi appaiono prima)

### 3. Configura i Campi del Form in `js/calculators-fields/nome_calcolatore.json`

Crea un file dedicato per il tuo calcolatore in `js/calculators-fields/`:

```json
{
  "info": true,
  "alertType": "info",
  "fields": [
      {
        "id": "campo1",
        "type": "number",
        "label": "calculators.nome_calcolatore.campo1",
        "min": 0,
        "step": 0.1,
        "placeholder": "100",
        "required": true,
        "helpText": "Testo di aiuto opzionale"
      },
      {
        "id": "campo2",
        "type": "select",
        "label": "calculators.nome_calcolatore.campo2",
        "required": true,
        "options": [
          {
            "value": "opzione1",
            "label": "calculators.nome_calcolatore.opzioni.opzione1"
          },
          {
            "value": "opzione2",
            "label": "calculators.nome_calcolatore.opzioni.opzione2"
          }
        ]
      }
    ]
}
```

**Vantaggi di file separati:**
- ✅ Ordine campi personalizzabile (basta riordinare l'array `fields`)
- ✅ Facile trovare e modificare la configurazione di un calcolatore
- ✅ Nessun file gigante con 30+ calcolatori
- ✅ Ogni calcolatore può avere complessità diversa

**Tipi di campo supportati:**
- `number`: input numerico con attributi `min`, `max`, `step`
- `select`: dropdown con array di `options`
- `text`: input testuale

**Attributi comuni:**
- `id`: nome del campo (deve corrispondere al parametro nella funzione JS)
- `type`: tipo di campo
- `label`: chiave di traduzione per la label
- `required`: se il campo è obbligatorio
- `placeholder`: testo placeholder
- `helpText`: testo di aiuto sotto il campo (opzionale)

### 4. Aggiungi le Traduzioni in Tutte le Lingue

Aggiungi le traduzioni in **tutti i 5 file** `locales/*.json` (it, en, fr, es, de):

```json
{
  "calculators": {
    "nome_calcolatore": {
      "title": "Titolo Calcolatore",
      "description": "Breve descrizione del calcolatore",
      "campo1": "Etichetta Campo 1",
      "campo2": "Etichetta Campo 2",
      "opzioni": {
        "opzione1": "Prima Opzione",
        "opzione2": "Seconda Opzione"
      },
      "results": {
        "risultato": "Risultato Calcolato",
        "campo1": "Campo 1",
        "campo2": "Campo 2"
      },
      "info": "Informazioni importanti sul calcolatore. Questa formula non tiene conto di..."
    }
  }
}
```

### 5. (Opzionale) Configura le Unità di Misura

Se i risultati hanno unità di misura specifiche, aggiungile in `js/modules/results-renderer.js`:

```javascript
const units = {
    nome_calcolatore: {
        risultato: 'g',
        campo1: 'L',
        campo2: 'g/L'
    }
};
```

### ✅ Fatto!

Il calcolatore apparirà automaticamente nella UI, il form verrà generato dalla configurazione, e sarà completamente tradotto in tutte le lingue.

### 📝 Checklist Finale

- [ ] File JavaScript del calcolatore creato e funzione esportata
- [ ] Entry aggiunta in `calculators-config.json`
- [ ] File configurazione campi creato in `js/calculators-fields/nome.json`
- [ ] Traduzioni aggiunte in tutti i 5 file `locales/*.json`
- [ ] Unità di misura configurate in `results-renderer.js` (se necessario)
- [ ] Calcolatore testato con valori reali
- [ ] Formula validata contro fonte AWRI o altra documentazione

## 🌍 Aggiungere Nuove Lingue

1. Crea un nuovo file in `locales/`, es. `pt.json` per il portoghese
2. Copia la struttura da un file esistente (es. `it.json`)
3. Traduci tutti i campi
4. Aggiungi la lingua in `js/i18n.js`:

```javascript
const SUPPORTED_LANGUAGES = ['it', 'en', 'fr', 'es', 'de', 'pt'];

const LANGUAGE_INFO = {
    // ... lingue esistenti ...
    pt: { name: 'Português', flag: '🇵🇹', code: 'PT' }
};
```

5. Aggiungi l'opzione nel dropdown della navbar in `index.html`

## 📝 Licenza

MIT License - Vedi file LICENSE per dettagli.

## 🙏 Ringraziamenti

- **AWRI (Australian Wine Research Institute)** - Ispirazione per i calcolatori e le formule enologiche
- **Bootstrap Team** - Framework CSS eccellente
- **Comunità Open Source** - Per gli strumenti e le librerie utilizzate

## 🐛 Segnalazione Bug

Se trovi un bug o hai un suggerimento:

1. Apri una [Issue su GitHub](https://github.com/TUO_USERNAME/winecalc/issues)
2. Descrivi il problema in dettaglio
3. Includi screenshot se possibile
4. Specifica browser e dispositivo utilizzato

## 🤝 Contribuire

I contributi sono benvenuti! Per contribuire:

1. Fai un Fork del repository
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📧 Contatti

Per domande o supporto, apri una Issue su GitHub.

---

**Fatto con ❤️ per gli enologi e i produttori di vino di tutto il mondo.**

🍇 **Buona vinificazione!** 🍷
