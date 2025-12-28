# 📲 Guida PWA - WineCalc

## ✅ Verificare che la PWA funzioni

### 1. Apri la pagina di controllo PWA
Dopo il deploy, visita:
```
https://tuosito.com/pwa-check.html
```

Questa pagina ti mostrerà lo stato di tutti i componenti PWA.

### 2. Verifica manualmente su Chrome Desktop

1. Apri DevTools (F12)
2. Vai su **Application** tab
3. Controlla:
   - **Manifest**: Deve mostrare tutte le informazioni
   - **Service Workers**: Deve essere "activated and running"
   - **Storage > Cache Storage**: Devono esserci le cache "winecalc-v1.3.0" e "winecalc-runtime"

### 3. Verifica su Chrome Android

1. Apri il sito su Chrome Android
2. Devi vedere un banner in basso con "Installa WineCalc"
3. Oppure vai su Menu (⋮) → "Installa app" o "Aggiungi a schermata Home"
4. Se vedi solo "Aggiungi a schermata Home" e NON "Installa app", significa che Chrome non riconosce la PWA

## 🔧 Requisiti PWA

Per funzionare come PWA, il sito DEVE:

### ✅ Requisiti Obbligatori
- [x] **HTTPS**: Il sito deve essere servito su HTTPS (o localhost per test)
- [x] **manifest.json**: Presente e valido con almeno 2 icone (192x192 e 512x512)
- [x] **Service Worker**: Registrato e attivo
- [x] **start_url**: Definito nel manifest
- [x] **name o short_name**: Nel manifest
- [x] **icons**: Almeno 192x192 e 512x512
- [x] **display**: standalone o fullscreen o minimal-ui

### ⚠️ Problemi Comuni

#### Problema: "Aggiungi a schermata Home" invece di "Installa app"
**Causa**: Chrome non riconosce l'app come PWA

**Soluzioni**:
1. Verifica che il sito sia su **HTTPS** (non HTTP!)
2. Controlla in Chrome DevTools > Application > Manifest che non ci siano errori
3. Verifica che il Service Worker sia registrato (Application > Service Workers)
4. Cancella cache e ricarica (Ctrl+Shift+R)
5. Aspetta qualche minuto - Chrome a volte impiega tempo a riconoscere la PWA

#### Problema: Service Worker non si registra
**Causa**: Errori nel file service-worker.js o percorsi sbagliati

**Soluzioni**:
1. Apri Console in DevTools e cerca errori
2. Verifica che `service-worker.js` sia nella root del sito
3. Controlla che non ci siano errori di sintassi
4. Verifica i percorsi dei file nel PRECACHE_URLS

#### Problema: Logo non si vede
**Causa**: Percorsi assoluti invece di relativi

**Soluzioni**:
- I percorsi devono essere relativi: `assets/img/logo-white.png` (NON `/assets/img/logo-white.png`)
- Verifica in DevTools > Network che l'immagine si carichi (status 200)

## 📱 Come Installare la PWA

### Su Android (Chrome)
1. Apri il sito su Chrome
2. Vedrai un banner in basso: "Installa WineCalc"
3. Tap su "Installa"
4. L'app verrà aggiunta alla home screen

**Oppure**:
1. Tap menu (⋮) in alto a destra
2. Tap "Installa app" o "Aggiungi a schermata Home"
3. Conferma

### Su iOS (Safari)
1. Apri il sito su Safari
2. Tap il pulsante Condividi (icona quadrato con freccia)
3. Scorri e tap "Aggiungi a Home"
4. Conferma

**Nota**: Su iOS la PWA funziona ma con limitazioni (niente Service Worker push, ecc.)

### Su Desktop (Chrome/Edge)
1. Apri il sito
2. Clicca l'icona di installazione nella barra degli indirizzi
3. Oppure: Menu → "Installa WineCalc"
4. L'app si aprirà in una finestra separata

## 🚀 Deployment

### GitHub Pages
```bash
git add .
git commit -m "PWA fixes"
git push origin main
```

Poi vai su Settings > Pages e seleziona il branch main.

**⚠️ IMPORTANTE**: GitHub Pages usa HTTPS automaticamente ✓

### Netlify
```bash
# Fai il deploy
# Il file _headers verrà usato automaticamente
```

### Vercel
```bash
vercel --prod
```

### Server Apache
Assicurati che il file `.htaccess` sia nella root e che `mod_mime` e `mod_headers` siano abilitati.

## 🧪 Test Locale con HTTPS

Per testare la PWA in locale con HTTPS:

```bash
# Opzione 1: Python con SSL (crea prima dei certificati self-signed)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
python3 -m http.server 8000 --bind localhost

# Opzione 2: Usa localhost (Chrome accetta PWA su localhost anche senza HTTPS)
python3 -m http.server 8000
# Poi apri http://localhost:8000
```

## 📊 Verificare l'Installazione

Dopo l'installazione:

1. L'icona WineCalc appare nella home/drawer
2. L'app si apre in modalità standalone (senza barre del browser)
3. Funziona offline
4. Le impostazioni vengono salvate localmente

## 🔄 Aggiornamenti

Quando aggiorni la PWA:

1. Cambia la versione in `service-worker.js`: `CACHE_NAME = 'winecalc-v1.3.1'`
2. Il Service Worker rileverà la nuova versione
3. Gli utenti vedranno una notifica: "Aggiornamento disponibile!"
4. Potranno cliccare "Aggiorna ora" per ricaricare

## 🐛 Debug

### Chrome DevTools
```
F12 > Application > Service Workers
```
Controlla:
- Status: "activated and running" ✓
- Source: service-worker.js
- Update on reload: OFF (per test)

### Console Logs
Il Service Worker stampa:
```
[Service Worker] Installing...
[Service Worker] Precaching static resources
[Service Worker] Installed successfully
[Service Worker] Activating...
[Service Worker] Activated successfully
```

### Lighthouse Audit
```
F12 > Lighthouse > Progressive Web App
```
Esegui l'audit e controlla i risultati. Punteggio > 90 = ✓

## 📞 Supporto

Se la PWA non funziona:
1. Controlla `/pwa-check.html` per vedere cosa manca
2. Verifica Chrome DevTools > Console per errori
3. Assicurati di essere su HTTPS
4. Prova in modalità incognito (per escludere problemi di cache)
5. Aspetta qualche minuto dopo il deploy
