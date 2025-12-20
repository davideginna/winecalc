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
- Aggiunta Acqua

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
├── index.html              # Homepage principale
├── README.md              # Questo file
│
├── css/
│   ├── theme.css          # Variabili tema e colori
│   └── styles.css         # Stili personalizzati
│
├── js/
│   ├── app.js             # Logica principale app
│   ├── i18n.js            # Sistema internazionalizzazione
│   ├── utils.js           # Funzioni utility
│   └── calculators/       # Moduli calcolatori
│       ├── so2.js         # Calcolatore SO2
│       ├── acid.js        # Calcolatore acidità
│       ├── fortification.js  # Calcolatore fortificazione
│       └── conversion.js  # Conversioni unità
│
├── locales/               # File traduzioni
│   ├── it.json            # Italiano
│   ├── en.json            # Inglese
│   ├── fr.json            # Francese
│   ├── es.json            # Spagnolo
│   └── de.json            # Tedesco
│
└── assets/
    └── icons/             # Icone personalizzate (opzionale)
```

## 🔧 Tecnologie Utilizzate

- **HTML5** - Struttura semantica
- **CSS3** - Stili moderni con variabili CSS
- **JavaScript ES6+** - Logica applicazione
- **Bootstrap 5.3.3** - Framework CSS responsive
- **Bootstrap Icons** - Icone
- **i18next** - Gestione multilingua

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
