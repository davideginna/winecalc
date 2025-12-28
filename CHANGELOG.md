# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2025-12-28

### Added
- **Progressive Web App (PWA) Support**
  - Full PWA implementation with offline functionality
  - App can now be installed on mobile and desktop devices
  - Service Worker caching for offline access
  - **Custom install banner** - Beautiful bottom banner with install/dismiss buttons
  - Install banner remembers user preference for 7 days when dismissed
  - Update notifications for new versions
  - 8 optimized PWA icons generated from logo-sfondo.png (72x72 to 512x512)
  - Web App Manifest with shortcuts to Calculators and Formulas pages
  - Apple iOS PWA support (apple-touch-icon, meta tags)
  - Cache-first strategy for static resources (HTML, CSS, JS, Bootstrap, i18next)
  - Runtime caching for dynamic resources (calculators, translations, formulas)
  - PWA utility functions (isPWA detection, cache clearing, update checking)
  - Automatic cache versioning (v1.3.0)
  - Install banner translations in all 5 languages (IT, EN, FR, ES, DE)
- **Diammonium Phosphate (DAP) Calculators (3 variants)**
  - **DAP Pre-Fermentation Calculator**
    - Determines amount of DAP needed to increase YAN (Yeast Assimilable Nitrogen) before fermentation
    - Inputs: Initial YAN level (mg/L), Required YAN level (mg/L), Volume (L or kg)
    - Calculates DAP in grams (2 decimals)
    - Assumes 4.7 mg/L DAP ≈ 1 mg/L YAN
    - Includes critical warnings about YAN limits (150-400 mg/L range)
    - Instructions for pre-harvest YAN analysis and inoculation timing
  - **DAP Addition Calculator**
    - For adding DAP to fermenting must (during fermentation)
    - Inputs: Amount of DAP required (mg/L), Volume (L or kg)
    - Calculates DAP in grams (2 decimals)
    - Includes warnings about H₂S removal timing and spoilage yeast risks
    - Guidance on phosphate limits (400 mg/L as phosphorus)
  - **YAN/DAP Converter**
    - Bidirectional converter between YAN and DAP
    - Inputs: YAN amount (mg/L) OR DAP amount (mg/L)
    - Returns both YAN and DAP equivalents
    - If both values entered, YAN to DAP conversion takes precedence
    - Includes explanation of YAN composition (FAN + Ammonium nitrogen)
    - Category: Reference Tools
  - All three calculators include comprehensive technical notes about nitrogen management
  - Complete formula documentation in formulas page
  - Translations for all 5 languages (IT, EN, FR, ES, DE)
- **Enhanced Notes for Copper Sulfate Calculators**
  - Added 5 critical operational notes to both large and small volume calculators:
    - Dilution and addition procedure (drip into tank while rummaging with gas)
    - Sensory-based addition requirements
    - Preference for copper sulfate over DAP for late-fermentation H₂S
    - Formula ratio clarification (3.93 parts copper sulfate = 1 part Cu2+)
    - Requirement for follow-up analysis verification
  - Notes added to all 5 languages (IT, EN, FR, ES, DE)

### Technical
- **PWA Files Created**
  - Created `/manifest.json` - Web App Manifest with app metadata, icons, shortcuts
  - Created `/service-worker.js` - Service Worker with precaching and runtime caching
  - Created `/js/pwa-install.js` - Install prompt handler with banner management and localStorage persistence
  - Generated 8 PWA icon sizes from `assets/img/logo-sfondo.png` (72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512)
  - Added PWA install banner HTML to `index.html` and `formulas.html`
  - Added PWA banner styles to `css/styles.css` with responsive mobile layout
  - Added PWA references to both HTML files (manifest link, theme-color meta, apple-touch-icon, pwa-install.js)
  - Added PWA install translations to all 5 `locales/*/common.json` files (pwa.install.title, description, button, dismiss)
- Created `js/calculators/dap-pre-fermentation.js` with YAN difference calculation
- Created `js/calculators/dap-addition.js` with simple DAP amount calculation
- Created `js/calculators/yan-dap-converter.js` with bidirectional conversion logic
- Created `js/calculators-fields/dap-pre-fermentation.json` with 4 fields (including volume unit selector)
- Created `js/calculators-fields/dap-addition.json` with 3 fields (including volume unit selector)
- Created `js/calculators-fields/yan-dap-converter.json` with optional fields for bidirectional input
- Created `formulas/dap-pre-fermentation.html` template
- Created `formulas/dap-addition.html` template
- Created `formulas/yan-dap-converter.html` template
- Updated `calculators-config.json` with 3 new entries (priorities 9, 10, 11)
- Updated `formulas.html` with 3 new collapsible formula sections
- Updated all 5 `locales/*/common.json` files with calculator titles and descriptions
- Created 15 calculator-specific translation files (3 calculators × 5 languages)
- Updated 10 copper sulfate translation files with enhanced operational notes

## [1.2.0] - 2025-12-27

### Added
- **Ascorbic Acid Calculator**
  - New calculator for ascorbic acid addition in wine preservation
  - Calculates amounts in grams, kilograms, and milligrams
  - Includes warnings about use with SO2
  - Complete formula documentation in formulas page
  - Translations for all 5 languages (IT, EN, FR, ES, DE)
- **Bentonite Addition Calculator**
  - New calculator for bentonite fining agent addition
  - Calculates volume of bentonite solution to add based on:
    - Desired addition rate (g/L)
    - Volume of wine/ferment/juice (L)
    - Concentration of prepared bentonite solution (% w/v)
  - Returns volume of solution needed in liters
  - Complete formula documentation in formulas page
  - Translations for all 5 languages (IT, EN, FR, ES, DE)
- **Carbon Addition Calculator**
  - New calculator for activated carbon (charcoal) addition
  - Used to remove color, off-odors, and certain compounds from wine/juice
  - Calculates amount in grams based on:
    - Amount of carbon (mg/L)
    - Volume of wine/juice (L)
  - Includes warnings about careful use
  - Complete formula documentation in formulas page
  - Translations for all 5 languages (IT, EN, FR, ES, DE)
- **Copper Sulfate Calculators (2 variants)**
  - **Large Volume Calculator** - for tanks, barrels, large volumes
    - Calculates CuSO₄·5H₂O weight in grams (2 decimals)
    - Inputs: Desired Cu2+ addition rate (mg/L), Wine volume (L)
    - Used to remove hydrogen sulfide (H₂S) and mercaptans
  - **Small Volume Calculator** - for bench trials, glass, small volumes
    - Calculates stock solution volume needed (mL and µL)
    - Inputs: Cu2+ rate (mg/L), Volume (mL or L), Stock concentration (% or g/L)
    - Supports unit selection for volume and concentration
  - Both calculators include warnings about legal limits and proper use
  - Complete formula documentation in formulas page
  - Translations for all 5 languages (IT, EN, FR, ES, DE)
- **Crème of Tartar Calculator**
  - New calculator for potassium bitartrate (crème of tartar) addition
  - Used for cold stabilization to prevent tartrate crystal formation
  - Calculates amount in kilograms based on:
    - Desired addition rate (mg/L)
    - Volume of wine (L)
  - Includes critical warnings: Only add when temperature < 0°C
  - Complete instructions for mixing and cold stabilization process
  - Complete formula documentation in formulas page
  - Translations for all 5 languages (IT, EN, FR, ES, DE)
- **Automatic Formula Translation System**
  - Generic translation system in `formulas.html` that works for all calculators
  - No need to modify JavaScript when adding new formulas
  - Automatic field detection using naming conventions
  - Supports both input and output field translations

### Changed
- **Calculator ID Naming System**
  - Calculator IDs can now include hyphens (e.g., "ascorbic-acid")
  - System automatically converts hyphens to underscores for function names
  - Updated `form-handler.js` and `calculator-manager.js` to handle conversion
  - Maintains consistency with URL-friendly naming
- **Removed External References**
  - Removed source links from formula templates
  - Updated all documentation to use generic "reference calculator" terminology
  - Updated README.md and CLAUDE.md to remove external dependencies
- **Updated Documentation**
  - Expanded `ADDING_CALCULATOR_GUIDE.md` with Step 6 for formulas
  - Updated examples to reflect new naming conventions
  - Added detailed instructions for formula page integration
  - Removed all external calculator references

### Fixed
- **Calculator Function Resolution**
  - Fixed issue where calculators with hyphens in ID couldn't be found
  - Calculator IDs like "ascorbic-acid" now correctly resolve to `calculate_ascorbic_acid()`
  - Proper validation before executing calculator functions
- **Mobile UI - Icon Circles**
  - Fixed icon circles appearing oval instead of round on mobile devices
  - Added `aspect-ratio: 1/1` and `flex-shrink: 0` to maintain perfect circles
  - Added `min-width` and `min-height` constraints on mobile viewports

### Technical
- Updated `js/modules/form-handler.js` to convert hyphens to underscores
- Updated `js/modules/calculator-manager.js` for hyphenated ID support
- Refactored `formulas.html` translation logic to be generic and reusable
- Created `formulas/ascorbic-acid.html` template
- Created `formulas/bentonite.html` template
- Created `formulas/carbon.html` template
- Created `formulas/copper-sulfate-large.html` template
- Created `formulas/copper-sulfate-small.html` template
- Created `formulas/creme-of-tartar.html` template
- Created `js/calculators/ascorbic-acid.js` calculator module
- Created `js/calculators/bentonite.js` calculator module
- Created `js/calculators/carbon.js` calculator module
- Created `js/calculators/copper-sulfate-large.js` calculator module (2 decimals precision)
- Created `js/calculators/copper-sulfate-small.js` calculator module
- Created `js/calculators/creme-of-tartar.js` calculator module
- Created `js/calculators-fields/ascorbic-acid.json` field configuration
- Created `js/calculators-fields/carbon.json` field configuration
- Created `js/calculators-fields/copper-sulfate-large.json` field configuration
- Created `js/calculators-fields/copper-sulfate-small.json` field configuration (with select fields)
- Created `js/calculators-fields/creme-of-tartar.json` field configuration
- Updated `js/calculators-fields/bentonite.json` field configuration
- Created namespace translations in `locales/*/ascorbic-acid.json` (5 languages)
- Created namespace translations in `locales/*/bentonite.json` (5 languages)
- Created namespace translations in `locales/*/carbon.json` (5 languages)
- Created namespace translations in `locales/*/copper-sulfate-large.json` (5 languages)
- Created namespace translations in `locales/*/copper-sulfate-small.json` (5 languages)
- Created namespace translations in `locales/*/creme-of-tartar.json` (5 languages)
- Added field descriptions in all `locales/*/common.json` files
- Updated `css/styles.css` to fix icon circle aspect ratio on mobile
- Validated all JSON files for syntax correctness

## [1.1.0] - 2025-12-24

### Added
- **Formulas Documentation Page** (`formulas.html`)
  - New dedicated page with mathematical formulas for all calculators
  - Collapsible sections for each calculator (closed by default)
  - "Expand All" and "Collapse All" buttons
  - Chevron icons that rotate on open/close
  - Link in mobile menu dropdown
  - Calculator icon in desktop navbar
- **Dynamic Formula Loading System**
  - New `formulas/` directory with individual HTML templates per calculator
  - Lazy loading: content loaded only when user opens collapse
  - On-demand translation loading
  - Session caching for performance
  - Complete documentation in `formulas/README.md`
- Formula display toggle button in calculator results (when formula available)
- Translations for formulas page in all 5 languages (IT, EN, FR, ES, DE)

### Changed
- **Localization System Refactoring**
  - Migrated from monolithic locale files to namespace-based structure
  - New structure: `locales/[lang]/common.json` + `locales/[lang]/[calculator].json`
  - i18next now uses namespaces (`common` as default, calculator-specific namespaces)
  - Calculator translations loaded lazily when needed
  - Improved scalability for 30+ calculators
- Moved `formula` flag from calculator config root to `results` section
- Updated calculator field config to use simple keys instead of full translation paths
- Favicon now uses correct path and MIME type (`image/jpeg` instead of `image/x-icon`)

### Fixed
- Formula toggle button now appears correctly in calculator results
- Favicon displays correctly in both `index.html` and `formulas.html`
- Translation loading order prevents showing translation keys on first render
- Proper namespacing prevents translation key conflicts

### Technical
- Added `loadCommonTranslations()` and `loadCalculatorTranslations()` in `js/i18n.js`
- Updated `js/modules/template-generator.js` to load calculator translations on demand
- Updated `js/modules/results-renderer.js` to use namespaced translations
- Modified calculator field configs to use namespace-based translation keys
- Removed old monolithic locale files (`locales/*.json`)

## [1.0.0] - 2025-12-21

### Added
- Initial release of the winemaking calculators website.
- Basic calculators for SO2, acid, fortification, and conversions.
- Basic HTML, CSS, and JavaScript structure.
- MIT License.
