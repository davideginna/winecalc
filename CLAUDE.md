# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WineCalc is a mobile-first web application for professional oenological (winemaking) calculations. It's a static web application built with vanilla JavaScript ES6+ modules, Bootstrap 5, and i18next for internationalization.

## Development Commands

### Local Development Server

The app requires a local server to avoid CORS issues with translation files:

```bash
# Python 3 (recommended)
python3 -m http.server 8000

# Node.js alternative
npx serve .

# Then open browser at http://localhost:8000
```

For mobile testing on local network, find your IP and use `http://[YOUR_IP]:8000`

### Testing on Mobile

1. Start local server
2. Find IP: `ifconfig | grep inet` (Linux/Mac) or `ipconfig` (Windows)
3. Access from phone: `http://[IP]:8000`

## Architecture

### Modular ES6 Structure

The application uses a modular architecture with clear separation of concerns:

**Core Entry Point:**
- `js/main.js` - Main orchestrator, initializes all modules in dependency order

**Module System (`js/modules/`):**
- `app-state.js` - Centralized state management (current calculator, modal instance, etc.)
- `calculator-loader.js` - Loads calculator configuration from `calculators-config.json`, generates cards, handles lazy loading of calculator modules
- `calculator-manager.js` - Manages calculator lifecycle (opening, closing, reloading)
- `template-generator.js` - Dynamically generates calculator forms from i18n definitions
- `form-handler.js` - Handles form submission and validation
- `results-renderer.js` - Renders calculation results
- `search-manager.js` - Handles calculator search/filtering

**Global Utilities (loaded as script tags, not ES6 modules):**
- `js/i18n.js` - Internationalization system using i18next, exposes `window.WineCalcI18n`
- `js/utils.js` - Utility functions, exposes `window.WineCalcUtils`
- `js/theme-manager.js` - Dark/light mode handling, exposes `window.ThemeManager`
- `js/settings-ui.js` - Settings modal management

**Calculator Modules (`js/calculators/`):**
Each calculator is a standalone module with a `calculate_[name]` function that takes data and returns results. Examples:
- `so2.js` - Sulfur dioxide calculations
- `acid.js` - Acidity calculations
- `fortification.js` - Alcohol fortification (Pearson Square method)
- `conversion.js` - Unit conversions

### Calculator System

**Configuration-Driven:**
- `calculators-config.json` defines all calculators with:
  - `id`: unique identifier
  - `enabled`: whether to show in UI
  - `category`: chemical/specialized/reference/sensory/additional
  - `icon`: Bootstrap icon class
  - `jsFile`: path to calculator module
  - `priority`: display order

**Dynamic Loading:**
1. `CalculatorLoader` reads config at startup
2. Generates calculator cards for enabled calculators
3. Lazy-loads calculator JS modules when opened
4. Each calculator module exports a `calculate_[id]()` function

**Template Generation:**
Forms are generated from i18n translation files. Each calculator in `locales/*.json` defines:
- `title`, `description`
- Field labels (e.g., `volume`, `currentSO2`)
- Field types (implicit from translation structure)
- Result field labels

### Internationalization

**5 Languages Supported:** IT (default), EN, FR, ES, DE

**Translation Files:** `locales/[lang].json`
- Structured by section: `nav`, `hero`, `categories`, `calculators`, `errors`
- Each calculator has its own section with all UI text
- Calculator form fields and results are defined in translations

**i18n System:**
- Uses i18next library
- Language preference stored in localStorage
- Falls back to browser language, then Italian
- Language changes trigger calculator reload to update form labels

### State Management

The `StateManager` module provides centralized state:
- `currentCalculator`: currently open calculator ID
- `calculatorInstances`: loaded calculator modules
- `modal`: Bootstrap modal instance
- `searchTerm`: current search filter

Access via `AppState` object or `StateManager.updateState()`

## Key Files

- `index.html` - Main page with navbar, hero, search, calculator cards container, modal
- `calculators-config.json` - Calculator registry and configuration
- `css/theme.css` - CSS variables for wine-themed colors
- `css/styles.css` - Custom styles

## Adding a New Calculator

1. Create calculator module in `js/calculators/[name].js`:
   ```javascript
   function calculate_[name](data) {
     // Validation
     if (!data.field) throw new Error(WineCalcI18n.t('errors.message'));

     // Calculation logic
     const result = /* ... */;

     // Return results object
     return { resultField: value };
   }
   ```

2. Add entry to `calculators-config.json`:
   ```json
   {
     "id": "name",
     "enabled": true,
     "category": "chemical",
     "icon": "bi-icon-name",
     "jsFile": "js/calculators/name.js",
     "priority": 99
   }
   ```

3. Add translations to all 5 locale files (`locales/*.json`):
   ```json
   "calculators": {
     "name": {
       "title": "Calculator Title",
       "description": "Brief description",
       "fieldName": "Field Label",
       "results": {
         "resultField": "Result Label"
       }
     }
   }
   ```

4. Calculator will automatically appear in UI, form will be generated from translations

## Code Style

- Use ES6+ features (modules, arrow functions, destructuring)
- Calculator functions are standalone (no classes)
- Use `WineCalcI18n.t()` for all user-facing text
- Validate inputs and throw errors with translated messages
- Round numeric results appropriately
- Return plain objects with result values

## Formula Documentation

Include formulas as comments in calculator modules:
```javascript
// Formula: Amount = (Volume × Difference) / (Factor × 1000)
```

This helps maintain accuracy and allows validation against reference sources.
