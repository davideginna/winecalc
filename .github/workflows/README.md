# GitHub Actions CI/CD Pipeline

Workflow unificato per test e deploy di WineCalc.

## 🔄 Flusso Automatico

### Push su `main` o `develop`

```
git push origin main
    ↓
┌─────────────┐
│  1. Tests   │  ← Esegue test su Node 18.x e 20.x
└──────┬──────┘
       ↓ (se passano)
┌─────────────┐
│  2. Deploy  │  ← Deploy su GitHub Pages (solo su main)
└──────┬──────┘
       ↓
┌─────────────┐
│  3. Summary │  ← Report finale
└─────────────┘
```

### Pull Request

```
PR verso main/develop
    ↓
┌─────────────┐
│  1. Tests   │  ← Esegue test (NO deploy)
└──────┬──────┘
       ↓
┌─────────────┐
│  2. Summary │  ← Report risultati
└─────────────┘
```

## 🚨 Deploy Emergenza (Salta Test)

### Quando Usarlo

⚠️ **Solo in caso di emergenza!** Esempio:
- Bug critico in produzione
- I test falliscono ma il fix è urgente
- Problema con l'infrastruttura di test

### Come Fare

1. Vai su GitHub → **Actions**
2. Clicca su **CI/CD Pipeline** (a sinistra)
3. Clicca sul pulsante **Run workflow** (a destra)
4. Seleziona le opzioni:
   - ✅ **Skip tests**: `true` (salta i test)
   - Branch: `main`
5. Clicca **Run workflow**

```
┌─────────────┐
│  1. Tests   │  ← SALTATO ⚠️
└─────────────┘
       ↓
┌─────────────┐
│  2. Deploy  │  ← Deploy diretto
└──────┬──────┘
       ↓
┌─────────────┐
│  3. Summary │  ← Mostra warning "Tests skipped"
└─────────────┘
```

### Screenshot Workflow Dispatch

```
┌──────────────────────────────────────┐
│ Run workflow                         │
│                                      │
│ Branch: [main ▼]                     │
│                                      │
│ Skip tests (emergency deploy only)  │
│ ☑ true                              │
│                                      │
│ Force deploy even on non-main branch│
│ ☐ false                             │
│                                      │
│        [Run workflow]                │
└──────────────────────────────────────┘
```

## 🎯 Opzioni Disponibili

### 1. `skip_tests`

**Descrizione:** Salta l'esecuzione dei test

**Valori:**
- `false` (default) - Esegue i test normalmente
- `true` - Salta i test ⚠️ EMERGENZA

**Quando usare `true`:**
- Bug critico in produzione
- Test falliscono per motivi esterni (es. timeout npm)
- Fix urgente necessario

**Effetti:**
- ❌ I test NON vengono eseguiti
- ✅ Il deploy procede direttamente
- ⚠️ Nel summary appare un warning

### 2. `deploy`

**Descrizione:** Forza il deploy anche su branch diversi da `main`

**Valori:**
- `false` (default) - Deploy solo su main
- `true` - Deploy anche su develop/feature

**Quando usare `true`:**
- Testare deploy su branch feature
- Preview di una PR
- Staging deployment

**Effetti:**
- ✅ Deploy eseguito anche se non sei su `main`
- ⚠️ Sovrascrive comunque GitHub Pages

## 📊 Job Spiegati

### Job 1: Test

```yaml
test:
  if: ${{ !inputs.skip_tests }}  # Esegue SOLO se skip_tests = false
  strategy:
    matrix:
      node-version: [18.x, 20.x]  # Testa su 2 versioni Node
```

**Cosa fa:**
1. Checkout del codice
2. Setup Node.js (18.x e 20.x in parallelo)
3. `npm ci` - Installa dipendenze (più veloce di `npm install`)
4. `npm test` - Esegue i 37 test
5. `npm run test:coverage` - Genera coverage (solo Node 20.x)
6. Upload coverage a Codecov

**Durata:** ~30-45 secondi per versione (totale ~1 minuto)

### Job 2: Deploy

```yaml
deploy:
  needs: test  # Dipende da test
  if: |
    always() &&
    (needs.test.result == 'success' || inputs.skip_tests == true) &&
    (github.ref == 'refs/heads/main' || inputs.deploy == true)
```

**Condizioni per eseguire:**
1. ✅ Test passati **OPPURE** test saltati
2. ✅ Branch = `main` **OPPURE** `deploy` forzato

**Cosa fa:**
1. Checkout del codice
2. Setup GitHub Pages
3. Upload tutto il contenuto come artifact
4. Deploy su GitHub Pages

**Durata:** ~20-30 secondi

### Job 3: Summary

```yaml
summary:
  needs: [test, deploy]
  if: always()  # Esegue SEMPRE
```

**Cosa fa:**
Genera un report riepilogativo che appare nella tab "Summary" dell'Action:

```markdown
## 🚀 CI/CD Pipeline Summary

✅ **Tests:** Passed
✅ **Deploy:** Completed

🌐 **Live URL:** https://davideginna.github.io/winecalc/

---
**Branch:** `main`
**Commit:** `a1b2c3d4`
```

## 🔍 Scenari Comuni

### Scenario 1: Push Normale su `main`

```bash
git push origin main
```

**Risultato:**
1. ✅ Test eseguiti su Node 18.x e 20.x
2. ✅ Deploy su GitHub Pages (se test passano)
3. ✅ Summary generato

**Tempo totale:** ~2-3 minuti

---

### Scenario 2: Push su `develop`

```bash
git push origin develop
```

**Risultato:**
1. ✅ Test eseguiti su Node 18.x e 20.x
2. ⏭️ Deploy SALTATO (non è main)
3. ✅ Summary generato

**Tempo totale:** ~1-2 minuti

---

### Scenario 3: Pull Request

```bash
git push origin feature-branch
# Crei PR verso main
```

**Risultato:**
1. ✅ Test eseguiti su Node 18.x e 20.x
2. ⏭️ Deploy SALTATO (è una PR)
3. ✅ Summary generato + check sulla PR

**Tempo totale:** ~1-2 minuti

---

### Scenario 4: Deploy Emergenza (Salta Test)

**GitHub UI:**
1. Actions → CI/CD Pipeline → Run workflow
2. `skip_tests`: `true`
3. Branch: `main`
4. Run workflow

**Risultato:**
1. ⚠️ Test SALTATI
2. ✅ Deploy ESEGUITO
3. ⚠️ Summary con warning

**Tempo totale:** ~30 secondi

---

### Scenario 5: Test Branch Feature con Deploy

**GitHub UI:**
1. Actions → CI/CD Pipeline → Run workflow
2. `skip_tests`: `false`
3. `deploy`: `true`
4. Branch: `feature-xyz`
5. Run workflow

**Risultato:**
1. ✅ Test eseguiti
2. ✅ Deploy ESEGUITO (anche se non main)
3. ✅ Summary generato

**Tempo totale:** ~2-3 minuti

## 📈 Monitorare le Actions

### Dashboard

```
GitHub → Repository → Actions tab

┌────────────────────────────────────────┐
│ All workflows                          │
│                                        │
│ ● CI/CD Pipeline (running)  2m 15s    │
│   ├─ Run Tests ✅                      │
│   ├─ Deploy to GitHub Pages ⏳         │
│   └─ Build Summary -                   │
│                                        │
│ ● CI/CD Pipeline (success)  2m 45s    │
│   Branch: main                         │
│   by: davideginna                      │
└────────────────────────────────────────┘
```

### Notifiche

GitHub ti notifica:
- ❌ Se i test falliscono
- ✅ Quando il deploy è completato
- ⚠️ Se c'è un problema

Puoi configurare:
- Email notifications
- Slack/Discord webhooks
- GitHub mobile app

## 🛡️ Protezioni Branch

Per massima sicurezza, configura branch protection su `main`:

**GitHub → Settings → Branches → Add rule**

```
Branch name pattern: main

✅ Require a pull request before merging
✅ Require status checks to pass before merging
  ✅ Run Tests
✅ Require branches to be up to date before merging
```

Questo previene push diretti su `main` senza PR e test.

## 🔧 Troubleshooting

### Test falliscono ma localmente passano

```bash
# Verifica versione Node
node --version  # Deve essere 18.x o 20.x

# Pulisci e reinstalla
rm -rf node_modules package-lock.json
npm install
npm test
```

### Deploy fallisce

**Controlla:**
1. GitHub Pages è abilitato (Settings → Pages)
2. Source = "GitHub Actions"
3. Permessi corretti nel workflow (già configurati)

### Workflow non parte

**Controlla:**
1. File è in `.github/workflows/`
2. Sintassi YAML corretta
3. Branch è `main` o `develop`

## 📚 Risorse

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [workflow_dispatch](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch)
- [GitHub Pages Actions](https://github.com/actions/deploy-pages)
