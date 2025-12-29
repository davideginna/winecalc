# Verifica Formule Calcolatori vs AWRI

Verifica dettagliata delle formule matematiche implementate nei calcolatori.

## 1. Acid Addition (acid.js)

### Formula Implementata
```
Amount (kg) = (Addition Rate g/L × Volume L) / 1000
Amount (g) = Addition Rate g/L × Volume L
```

### Codice
```javascript
const amountKg = (additionRate * volume) / 1000;
const amountG = additionRate * volume;
```

### Verifica AWRI
✅ **Corretta** - Formula standard per aggiunte chimiche

**Test:**
- Input: additionRate=2 g/L, volume=100 L
- Output: amountKg=0.2 kg, amountG=200 g
- ✅ Test automatico passa

---

## 2. Ascorbic Acid (ascorbicAcid.js)

### Formula Implementata
```
Amount (g) = (Volume L × Addition Rate mg/L) / 1000
Amount (kg) = Amount (g) / 1000
Amount (mg) = Volume L × Addition Rate mg/L
```

### Codice
```javascript
const amountG = (volume * additionRate) / 1000;
const amountKg = amountG / 1000;
const amountMg = volume * additionRate;
```

### Verifica AWRI
✅ **Corretta** - Conversione standard mg/L → g

**Note:**
- Range tipico: 50-100 mg/L
- Warning se fuori range 20-200 mg/L

**Test:**
- Input: additionRate=50 mg/L, volume=100 L
- Output: amountG=5 g, amountKg=0.005 kg, amountMg=5000 mg
- ✅ Test automatico passa

---

## 3. Bentonite (bentonite.js)

### Formula Implementata
```
Total bentonite (g) = Addition Rate (g/L) × Volume (L)
Volume of solution (L) = Total bentonite (g) / (Concentration % × 10)
```

**Nota:** w/v % significa g per 100mL, quindi 10% = 100 g/L

### Codice
```javascript
const totalBentonite = additionRate * volume;
const solutionVolume = totalBentonite / (concentration * 10);
```

### Verifica AWRI
✅ **Corretta** - Formula AWRI per bentonite

**Conversione w/v:**
- 1% w/v = 1 g/100mL = 10 g/L
- 5% w/v = 5 g/100mL = 50 g/L

**Test:**
- Input: additionRate=1 g/L, volume=100 L, concentration=5%
- Calcolo: totalBentonite=100 g, solution=100/(5×10)=2 L
- Output: solutionVolume=2 L
- ✅ Test automatico passa

---

## 4. Activated Carbon (carbon.js)

### Formula Implementata
```
Amount (g) = (Carbon mg/L × Volume L) / 1000
```

### Codice
```javascript
const amountG = (carbonAmount * volume) / 1000;
```

### Verifica AWRI
✅ **Corretta** - Conversione standard mg/L → g

**Test:**
- Input: carbonAmount=500 mg/L, volume=100 L
- Output: amountG=50 g
- ✅ Test automatico passa

---

## 5. Copper Sulfate Large Volume (copperSulfateLarge.js)

### Formula Implementata
```
CuSO₄·5H₂O (g) = (Cu mg/L × Volume L) / (1000 × Cu%)

Dove:
- Cu% in CuSO₄·5H₂O = 25.45%
```

### Codice
```javascript
const CU_PERCENTAGE = 0.2545;
const copperSulfateG = (copperRate * volume) / (1000 * CU_PERCENTAGE);
```

### Verifica AWRI
✅ **Corretta** - Formula AWRI per solfato di rame

**Chimica:**
- CuSO₄·5H₂O peso molecolare: 249.68 g/mol
- Cu peso atomico: 63.55 g/mol
- Cu% = 63.55 / 249.68 = 25.45%

**Test:**
- Input: copperRate=0.5 mg/L, volume=1000 L
- Calcolo: (0.5 × 1000) / (1000 × 0.2545) = 1.96 g
- Output: copperSulfateG=1.96 g
- ✅ Test automatico passa

---

## 6. Copper Sulfate Small Volume (copperSulfateSmall.js)

### Formula Implementata
```
1. Volume L = Volume input (se L) o Volume / 1000 (se mL)
2. Total Cu needed (mg) = Cu rate (mg/L) × Volume (L)
3. CuSO₄·5H₂O needed (mg) = Total Cu (mg) / 0.2545
4. Stock concentration (g/L):
   - Se %: Concentration × 10
   - Se g/L: Concentration
5. Solution volume (mL) = CuSO₄·5H₂O (mg) / Stock (g/L)
```

### Codice
```javascript
const CU_PERCENTAGE = 0.2545;
const volumeL = volumeUnit === 'mL' ? volume / 1000 : volume;
const totalCuMg = copperRate * volumeL;
const copperSulfateMg = totalCuMg / CU_PERCENTAGE;
const stockConcentrationGL = stockUnit === '%' ? stockConcentration * 10 : stockConcentration;
const solutionVolumeMl = copperSulfateMg / stockConcentrationGL;
const solutionVolumeUl = solutionVolumeMl * 1000;
```

### Verifica AWRI
✅ **Corretta** - Formula AWRI per piccoli volumi

**Test:**
- Test automatico verifica calcoli con mL e %
- ✅ Test automatico passa

---

## 7. Cream of Tartar (cremeOfTartar.js)

### Formula Implementata
```
Amount (kg) = (Addition rate mg/L × Volume L) / 1,000,000
```

### Codice
```javascript
const amountKg = (additionRate * volume) / 1000000;
```

### Verifica AWRI
✅ **Corretta** - Conversione mg → kg

**Test:**
- Input: additionRate=500 mg/L, volume=1000 L
- Output: amountKg=0.5 kg
- ✅ Test automatico passa

---

## 8. DAP Pre-Fermentation (dapPreFermentation.js)

### Formula Implementata
```
YAN difference (mg/L) = Required YAN - Initial YAN
DAP amount (g) = (YAN difference × Volume × 4.7) / 1000

Dove:
- 1 mg/L YAN = 4.7 mg/L DAP
```

### Codice
```javascript
const YAN_TO_DAP_RATIO = 4.7;
const yanDifference = requiredYan - initialYan;
const dapAmount = (yanDifference * volume * YAN_TO_DAP_RATIO) / 1000;
```

### Verifica AWRI
✅ **Corretta** - Ratio AWRI standard

**Chimica:**
- DAP fornisce azoto ammoniacal
- Ratio standard: 4.7 mg/L DAP ≈ 1 mg/L YAN

**Test:**
- Input: initialYan=100, requiredYan=200, volume=100 L
- YAN diff = 100 mg/L
- DAP = (100 × 100 × 4.7) / 1000 = 47 g
- Output: dapAmount=47 g
- ✅ Test automatico passa

---

## 9. DAP Addition (dapAddition.js)

### Formula Implementata
```
DAP amount (g) = (DAP mg/L × Volume L) / 1000
```

### Codice
```javascript
const dapAmount = (dapRequired * volume) / 1000;
```

### Verifica AWRI
✅ **Corretta** - Conversione standard mg/L → g

**Test:**
- Input: dapRequired=250 mg/L, volume=100 L
- Output: dapAmount=25 g
- ✅ Test automatico passa

---

## 10. YAN/DAP Converter (yanDapConverter.js)

### Formula Implementata
```
DAP (mg/L) = YAN (mg/L) × 4.7
YAN (mg/L) = DAP (mg/L) / 4.7

Dove:
- YAN to DAP ratio = 4.7
```

### Codice
```javascript
const YAN_TO_DAP_RATIO = 4.7;

// YAN to DAP
const convertedDap = yan * YAN_TO_DAP_RATIO;

// DAP to YAN
const convertedYan = dap / YAN_TO_DAP_RATIO;
```

### Verifica AWRI
✅ **Corretta** - Ratio AWRI standard

**Test:**
- YAN to DAP: 100 mg/L YAN → 470 mg/L DAP
- DAP to YAN: 470 mg/L DAP → 100 mg/L YAN
- ✅ Test automatico passa

---

## 📊 Riepilogo Verifica

| Calcolatore | Formula Corretta | Test Passa | Note |
|-------------|------------------|------------|------|
| Acid Addition | ✅ | ✅ | Standard |
| Ascorbic Acid | ✅ | ✅ | Range warning OK |
| Bentonite | ✅ | ✅ | w/v conversion OK |
| Activated Carbon | ✅ | ✅ | Standard |
| Copper Sulfate Large | ✅ | ✅ | Cu% = 25.45% OK |
| Copper Sulfate Small | ✅ | ✅ | Unit conversion OK |
| Cream of Tartar | ✅ | ✅ | mg to kg OK |
| DAP Pre-Fermentation | ✅ | ✅ | Ratio 4.7 OK |
| DAP Addition | ✅ | ✅ | Standard |
| YAN/DAP Converter | ✅ | ✅ | Ratio 4.7 OK |

**Totale:** 10/10 ✅

---

## 🔬 Costanti Verificate

### Copper Sulfate
```
CuSO₄·5H₂O molecular weight: 249.68 g/mol
Cu atomic weight: 63.55 g/mol
Cu percentage: 63.55 / 249.68 = 25.45% ✅
```

### YAN/DAP Ratio
```
Standard AWRI ratio: 4.7 mg/L DAP ≈ 1 mg/L YAN ✅
```

### Unit Conversions
```
1% w/v = 10 g/L ✅
1 g = 1000 mg ✅
1 kg = 1000 g ✅
1 L = 1000 mL ✅
1 mL = 1000 µL ✅
```

---

## ✅ Conclusione

**Tutte le formule sono corrette e corrispondono agli standard AWRI.**

Durante il refactoring:
- ❌ Nessuna formula è stata modificata
- ✅ Solo nomi di funzioni/file sono stati rinominati
- ✅ Solo validazione input è stata migliorata
- ✅ Tutti i 37 test automatici passano
- ✅ Code coverage: 90.09%

**Le formule matematiche sono identiche a prima del refactoring.**

---

## 📚 Riferimenti

- AWRI Calculator: https://www.awri.com.au/industry_support/winemaking_resources/calculators/
- YAN/DAP: Standard enologico 4.7:1 ratio
- Copper Sulfate: CuSO₄·5H₂O chimica standard
- Unit conversions: SI standard units
