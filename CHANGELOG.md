# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2025-12-29

### Added
- **Automated Test Suite with Jest**
  - Comprehensive test coverage for all 10 calculator functions (90%+ code coverage)
  - 37 automated tests covering function existence, input validation, and calculation accuracy
  - Input validation tests: empty values, NaN, negative values, zero values
  - Calculation accuracy tests with known inputs/outputs
  - Test scripts: `npm test`, `npm run test:watch`, `npm run test:coverage`
  - GitHub Actions workflow for continuous integration
  - Tests run automatically on push to main/develop branches
  - Multi-version Node.js testing (18.x, 20.x)
  - Coverage reports generated automatically
  - Test documentation in `tests/README.md`

### Changed
- **Code Refactoring - Naming Convention Standardization**
  - Migrated all calculator files and functions from kebab-case to camelCase naming convention
  - Eliminated runtime string conversions for improved performance and code maintainability
  - 10 calculators refactored to camelCase: acid, ascorbicAcid, bentonite, carbon, copperSulfateLarge, copperSulfateSmall, cremeOfTartar, dapPreFermentation, dapAddition, yanDapConverter
  - Calculator IDs in `calculators-config.json` now use camelCase (e.g., `ascorbicAcid` instead of `ascorbic-acid`)
  - Function names updated to camelCase (e.g., `calculateAscorbicAcid` instead of `calculate_ascorbic_acid`)
  - All translation keys updated to use camelCase (e.g., `calculators.ascorbicAcid.title`)
  - Formula template files and IDs updated to camelCase

### Fixed
- **Input Validation - All Calculators**
  - Fixed issue where empty form fields showed results instead of validation errors
  - Added `isNaN()` checks to all numeric input validations
  - All calculators now properly reject empty, null, NaN, and invalid values
  - Improved error messages for better user feedback

### Technical
- **Test Infrastructure**
  - Created `package.json` with Jest configuration
  - Created `tests/calculators.test.js` with 37 comprehensive tests
  - Created `.github/workflows/test.yml` for CI/CD pipeline
  - Added `tests/README.md` with testing documentation
  - Test coverage: 90.09% statements, 90.57% branches, 100% functions
  - All 10 calculator functions validated for existence and correct exports
- **File Renames (49 files total)**
  - Renamed 7 calculator JS files (e.g., `ascorbic-acid.js` → `ascorbicAcid.js`)
  - Renamed 7 field configuration files (e.g., `ascorbic-acid.json` → `ascorbicAcid.json`)
  - Renamed 35 translation files across 5 languages (7 calculators × 5 languages)
  - Renamed 7 formula template files (e.g., `ascorbic-acid.html` → `ascorbicAcid.html`)
- **Function Updates**
  - Updated ALL 10 calculator function declarations from snake_case to camelCase
  - Updated window exports to use camelCase (e.g., `window.calculateAscorbicAcid`)
  - Added window exports to dapPreFermentation.js, dapAddition.js, yanDapConverter.js
  - Fixed acid.js, bentonite.js, carbon.js to match new naming convention
- **Configuration Updates**
  - Updated `calculators-config.json` with new camelCase IDs and file paths
  - Updated `common.json` in all 5 languages with camelCase keys
  - Updated `formulas.html` with camelCase collapse IDs and data-i18n keys
- **Code Cleanup**
  - Removed kebab-case to snake_case conversion logic from `calculator-loader.js`
  - Simplified function lookup to use camelCase directly
  - Function name pattern: calculatorId "ascorbicAcid" → function "calculateAscorbicAcid"
- **Validation Improvements**
  - Added `isNaN()` checks to all 10 calculator validation functions
  - Enhanced error handling for edge cases (undefined, null, empty string, zero)
  - Consistent validation pattern across all calculators

## [1.3.0] - 2025-12-28

### Fixed
- **PWA Installation and Logo Display**
  - Fixed logo not displaying by changing from absolute paths (`/assets/`) to relative paths (`assets/`)
  - Fixed PWA not being installable by updating `manifest.json` with relative paths (`start_url: "."`, `scope: "."`)
  - Changed `orientation` from `portrait-primary` to `any` for better flexibility
  - Updated service worker to use relative paths (`./index.html` instead of `/index.html`)
  - Added `pwa-install.js`, icons, and logo to service worker precache list
  - Created `.htaccess` for Apache servers with proper MIME types and cache control
  - Created `_headers` for Netlify deployments with PWA-optimized cache strategy
  - Added `prefer_related_applications: false` to manifest to prefer PWA over native apps

### Added
- **New Navbar Logo** - Replaced emoji icon and text with professional logo-white.png image
  - Responsive sizing: 40px on desktop, 32px on mobile
  - Maintains aspect ratio automatically
  - Smooth hover animation

### Changed
- **Performance Optimization - Calculator Function Caching**
  - Eliminated runtime string conversions (kebab-case to snake_case)
  - Calculator functions are now cached in a Map when modules are loaded
  - `calculator-manager.js` and `form-handler.js` now use cached function references
  - Performance improvement: O(1) Map lookup instead of string conversion on every calculation
  - Implementation: Added `calculatorFunctions` Map to `app-state.js` with helper methods
- **Standardized UI Across Pages**
  - Unified navbar order: Home → Formule (mobile only) → Lingue → Formule (desktop icon) → Dark Mode → Settings
  - Formule link now responsive: full link with icon on mobile, icon-only on desktop
  - Settings modal now identical on both index.html and formulas.html
  - Settings modal includes full feature set: Theme Mode, Color Theme (5 themes), Accessibility options (High Contrast, Reduced Motion, Large Text), Reset button
  - Consistent styling with wine-themed header and centered modal
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
- **Performance Optimization Implementation**
  - Added `calculatorFunctions` Map to `AppState` in `app-state.js`
  - Added `registerCalculatorFunction()`, `getCalculatorFunction()`, `hasCalculatorFunction()` methods to `StateManager`
  - Updated `calculator-loader.js` to cache function reference after loading module
  - Updated `calculator-manager.js` to use `StateManager.hasCalculatorFunction()` (removed string conversion)
  - Updated `form-handler.js` to use `StateManager.getCalculatorFunction()` (removed string conversion)
  - Conversion from kebab-case to snake_case now happens only once at module load time
- **PWA Path Corrections**
  - Updated all HTML files to use relative paths (removed leading slashes)
  - Updated `manifest.json`: `start_url: "."`, `scope: "."`, `orientation: "any"`
  - Updated `service-worker.js` PRECACHE_URLS to use `./` prefix
  - Added service worker cache entries for logo, icons, and pwa-install.js
  - Created `.htaccess` with PWA MIME types and cache control headers
  - Created `_headers` for Netlify with optimized caching strategy
- **Navbar Logo Implementation**
  - Updated `index.html` and `formulas.html` to use `<img>` tag with logo-white.png
  - Added `.navbar-logo` CSS class with responsive height (40px desktop, 32px mobile)
  - Updated `.navbar-brand` padding for better logo alignment
- **UI Standardization**
  - Updated `formulas.html` navbar to match `index.html` responsive structure (d-lg-none/d-none d-lg-block)
  - Replaced simplified settings modal in `formulas.html` with full-featured version from `index.html`
  - Unified element IDs (highContrastSwitch, reducedMotionSwitch, largeTextSwitch instead of highContrast, reducedMotion, largeText)
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
