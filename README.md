# 🍷 WineCalc - Calcolatori Enologici Professionali

Applicazione web mobile-first per calcoli enologici professionali.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-purple.svg)](https://getbootstrap.com/)

## 🌟 Caratteristiche

- ✅ **Calcolatori Enologici Professionali**
- 🌍 **Multilingua** - Supporto completo per IT, EN, FR, ES, DE
- 📱 **Mobile-First** - Design ottimizzato per smartphone e tablet
- 📲 **Progressive Web App (PWA)** - Installabile su mobile e desktop, funziona offline
- 🎨 **Interfaccia Moderna** - Bootstrap 5 con tema personalizzato ispirato al vino
- ⚡ **Veloce e Leggero** - Nessuna dipendenza backend, solo HTML/CSS/JS
- 🔧 **Open Source** - Codice libero e modificabile

## 📋 Calcolatori Disponibili

### Aggiunte Chimiche (15)
- ✅ Anidride Solforosa (SO2)
- Aggiunta Acidi
- Bentonite
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
- Fortificazione
- Prova Ferrocianuro
- Prova di Chiarifica
- Aggiunta Mosto Concentrato (GJC)
- Micro-ossigenazione
- SO2 Molecolare
- Aggiunta Acqua

### Strumenti di Riferimento (4)
- Conversioni Generali
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

### Opzione 1: npm (Consigliato)

```bash
# Installa le dipendenze (solo la prima volta)
npm install

# Avvia il server
npm start

# Apri il browser su:
# http://localhost:8000
```

### Opzione 2: Python HTTP Server

```bash
# Python 3
python3 -m http.server 8000

# Apri il browser su:
# http://localhost:8000
```

## 🧪 Testing

```bash
# Esegui tutti i test
npm test

# Esegui test con coverage
npm run test:coverage

# Esegui test in watch mode (auto-rerun)
npm run test:watch
```

✅ **37 test automatici** - 90%+ code coverage
✅ **GitHub Actions CI/CD** - Test automatici ad ogni push

## 📱 Accesso da Smartphone

Per testare l'app dal tuo smartphone sulla rete locale:

1. Avvia il server: `npm start`
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

## 📲 Installazione PWA (Progressive Web App)

WineCalc può essere installato come app nativa su smartphone e desktop:

### Su Mobile (Android/iOS)
1. Apri l'app nel browser (Chrome/Safari)
2. Cerca l'opzione "Aggiungi a schermata home" o "Installa app"
3. Su Android: tap sul menu (⋮) > "Installa app" o "Aggiungi a schermata Home"
4. Su iOS/Safari: tap sul pulsante condividi > "Aggiungi a schermata Home"

### Su Desktop (Chrome/Edge)
1. Apri l'app nel browser
2. Cerca l'icona di installazione nella barra degli indirizzi
3. Oppure: Menu > "Installa WineCalc"

### Vantaggi della PWA
- ✅ **Funziona offline** - Accesso ai calcolatori senza connessione
- ✅ **Icona sulla schermata home** - Avvio rapido come un'app nativa
- ✅ **Nessun app store** - Installazione diretta dal browser
- ✅ **Aggiornamenti automatici** - Sempre l'ultima versione
- ✅ **Esperienza nativa** - Schermo intero, niente barre del browser

> **Nota**: La PWA richiede HTTPS per funzionare. Su localhost non è necessario, ma per l'installazione da remoto serve un certificato SSL.


## 🔧 Tecnologie Utilizzate

- **HTML5** - Struttura semantica
- **CSS3** - Stili moderni con variabili CSS
- **JavaScript ES6+** - Logica applicazione con moduli ES6
- **Bootstrap 5.3.3** - Framework CSS responsive
- **Bootstrap Icons** - Icone
- **i18next** - Gestione multilingua
- **Service Worker** - Funzionalità offline e caching
- **Web App Manifest** - Installabilità PWA

## 🏗️ Architettura e Flusso Dati

WineCalc utilizza un'architettura **modulare basata su configurazione JSON** che permette di aggiungere nuovi calcolatori facilmente senza modificare il codice core. Controllare il file ARCHITECTURE.md per i dettagli.

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
