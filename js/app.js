/* WineCalc - Main Application Logic */

// Application state
const AppState = {
    currentCalculator: null,
    searchQuery: '',
    modal: null
};

// Initialize application
function initializeApp() {
    console.log('Initializing WineCalc application...');

    // Initialize Bootstrap modal
    const modalElement = document.getElementById('calculatorModal');
    if (modalElement) {
        AppState.modal = new bootstrap.Modal(modalElement);
    }

    // Setup event listeners
    setupSearchListener();
    setupCalculatorLinks();
    setupModalCloseListener();

    console.log('WineCalc application initialized');
}

// Setup search functionality
function setupSearchListener() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const debouncedSearch = WineCalcUtils.debounce((query) => {
        filterCalculators(query);
    }, 300);

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        AppState.searchQuery = query;
        debouncedSearch(query);
    });
}

// Filter calculators based on search query
function filterCalculators(query) {
    const cards = document.querySelectorAll('.calculator-card');
    const noResults = document.getElementById('noResults');
    let visibleCount = 0;

    cards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.card-text')?.textContent.toLowerCase() || '';

        const matches = name.includes(query) ||
                       title.includes(query) ||
                       description.includes(query);

        if (matches || query === '') {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show/hide no results message
    if (noResults) {
        if (visibleCount === 0 && query !== '') {
            noResults.classList.remove('d-none');
        } else {
            noResults.classList.add('d-none');
        }
    }

    // Hide/show category sections based on visible cards
    document.querySelectorAll('section').forEach(section => {
        const visibleCardsInSection = section.querySelectorAll('.calculator-card:not([style*="display: none"])').length;
        if (visibleCardsInSection === 0) {
            section.style.display = 'none';
        } else {
            section.style.display = '';
        }
    });
}

// Setup calculator links
function setupCalculatorLinks() {
    document.querySelectorAll('.calculator-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const calculatorId = e.currentTarget.dataset.calculator;
            openCalculator(calculatorId);
        });
    });
}

// Open calculator in modal
function openCalculator(calculatorId) {
    console.log(`Opening calculator: ${calculatorId}`);
    AppState.currentCalculator = calculatorId;

    // Load calculator content
    loadCalculatorContent(calculatorId);

    // Show modal
    if (AppState.modal) {
        AppState.modal.show();
    }
}

// Load calculator content into modal
function loadCalculatorContent(calculatorId) {
    const content = document.getElementById('calculatorContent');
    const modalLabel = document.getElementById('calculatorModalLabel');

    if (!content) return;

    // Update modal title
    if (modalLabel) {
        modalLabel.textContent = WineCalcI18n.t(`calculators.${calculatorId}.title`);
    }

    // Check if calculator module exists
    if (typeof window[`Calculator_${calculatorId}`] === 'function') {
        // Load calculator from module
        content.innerHTML = window[`Calculator_${calculatorId}`]();
    } else {
        // Fallback: load generic calculator template
        content.innerHTML = getCalculatorTemplate(calculatorId);
    }

    // Setup calculator form listener
    setupCalculatorForm(calculatorId);
}

// Get calculator template
function getCalculatorTemplate(calculatorId) {
    const t = WineCalcI18n.t;

    switch (calculatorId) {
        case 'so2':
            return getSO2Template();
        case 'acid':
            return getAcidTemplate();
        case 'fortification':
            return getFortificationTemplate();
        case 'conversion':
            return getConversionTemplate();
        default:
            return `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    ${t('common.comingSoon') || 'Coming soon...'}
                </div>
                <p>${t(`calculators.${calculatorId}.description`)}</p>
            `;
    }
}

// Get SO2 calculator template
function getSO2Template() {
    const t = WineCalcI18n.t;

    return `
        <div class="alert alert-info mb-4">
            <i class="bi bi-info-circle me-2"></i>
            ${t('calculators.so2.info')}
        </div>

        <form id="calculatorForm" class="calculator-form">
            <div class="mb-3">
                <label for="volume" class="form-label">${t('calculators.so2.volume')}</label>
                <input type="number" class="form-control" id="volume" name="volume"
                       min="0" step="0.1" required>
            </div>

            <div class="mb-3">
                <label for="currentSO2" class="form-label">${t('calculators.so2.currentSO2')}</label>
                <input type="number" class="form-control" id="currentSO2" name="currentSO2"
                       min="0" step="1" required>
            </div>

            <div class="mb-3">
                <label for="targetSO2" class="form-label">${t('calculators.so2.targetSO2')}</label>
                <input type="number" class="form-control" id="targetSO2" name="targetSO2"
                       min="0" step="1" required>
            </div>

            <div class="mb-3">
                <label for="sulfiteType" class="form-label">${t('calculators.so2.sulfiteType')}</label>
                <select class="form-select" id="sulfiteType" name="sulfiteType" required>
                    <option value="potassium_metabisulfite">${t('calculators.so2.types.potassium_metabisulfite')}</option>
                    <option value="sodium_metabisulfite">${t('calculators.so2.types.sodium_metabisulfite')}</option>
                    <option value="sulfur_dioxide_gas">${t('calculators.so2.types.sulfur_dioxide_gas')}</option>
                </select>
            </div>

            <div id="errorContainer"></div>

            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <button type="reset" class="btn btn-outline-secondary">
                    <i class="bi bi-arrow-clockwise me-2"></i>${t('common.reset')}
                </button>
                <button type="submit" class="btn btn-wine">
                    <i class="bi bi-calculator me-2"></i>${t('common.calculate')}
                </button>
            </div>
        </form>

        <div id="resultsContainer"></div>
    `;
}

// Get Acid calculator template
function getAcidTemplate() {
    const t = WineCalcI18n.t;

    return `
        <div class="alert alert-info mb-4">
            <i class="bi bi-info-circle me-2"></i>
            ${t('calculators.acid.info')}
        </div>

        <form id="calculatorForm" class="calculator-form">
            <div class="mb-3">
                <label for="volume" class="form-label">${t('calculators.acid.volume')}</label>
                <input type="number" class="form-control" id="volume" name="volume"
                       min="0" step="0.1" required>
            </div>

            <div class="mb-3">
                <label for="currentTA" class="form-label">${t('calculators.acid.currentTA')}</label>
                <input type="number" class="form-control" id="currentTA" name="currentTA"
                       min="0" step="0.1" required>
            </div>

            <div class="mb-3">
                <label for="targetTA" class="form-label">${t('calculators.acid.targetTA')}</label>
                <input type="number" class="form-control" id="targetTA" name="targetTA"
                       min="0" step="0.1" required>
            </div>

            <div class="mb-3">
                <label for="acidType" class="form-label">${t('calculators.acid.acidType')}</label>
                <select class="form-select" id="acidType" name="acidType" required>
                    <option value="tartaric">${t('calculators.acid.types.tartaric')}</option>
                    <option value="citric">${t('calculators.acid.types.citric')}</option>
                    <option value="malic">${t('calculators.acid.types.malic')}</option>
                </select>
            </div>

            <div id="errorContainer"></div>

            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <button type="reset" class="btn btn-outline-secondary">
                    <i class="bi bi-arrow-clockwise me-2"></i>${t('common.reset')}
                </button>
                <button type="submit" class="btn btn-wine">
                    <i class="bi bi-calculator me-2"></i>${t('common.calculate')}
                </button>
            </div>
        </form>

        <div id="resultsContainer"></div>
    `;
}

// Get Fortification calculator template
function getFortificationTemplate() {
    const t = WineCalcI18n.t;

    return `
        <div class="alert alert-info mb-4">
            <i class="bi bi-info-circle me-2"></i>
            ${t('calculators.fortification.info')}
        </div>

        <form id="calculatorForm" class="calculator-form">
            <div class="mb-3">
                <label for="volume" class="form-label">${t('calculators.fortification.volume')}</label>
                <input type="number" class="form-control" id="volume" name="volume"
                       min="0" step="0.1" required>
            </div>

            <div class="mb-3">
                <label for="currentAlcohol" class="form-label">${t('calculators.fortification.currentAlcohol')}</label>
                <input type="number" class="form-control" id="currentAlcohol" name="currentAlcohol"
                       min="0" max="100" step="0.1" required>
            </div>

            <div class="mb-3">
                <label for="targetAlcohol" class="form-label">${t('calculators.fortification.targetAlcohol')}</label>
                <input type="number" class="form-control" id="targetAlcohol" name="targetAlcohol"
                       min="0" max="100" step="0.1" required>
            </div>

            <div class="mb-3">
                <label for="spiritStrength" class="form-label">${t('calculators.fortification.spiritStrength')}</label>
                <input type="number" class="form-control" id="spiritStrength" name="spiritStrength"
                       min="0" max="100" step="0.1" value="96" required>
            </div>

            <div id="errorContainer"></div>

            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <button type="reset" class="btn btn-outline-secondary">
                    <i class="bi bi-arrow-clockwise me-2"></i>${t('common.reset')}
                </button>
                <button type="submit" class="btn btn-wine">
                    <i class="bi bi-calculator me-2"></i>${t('common.calculate')}
                </button>
            </div>
        </form>

        <div id="resultsContainer"></div>
    `;
}

// Get Conversion calculator template
function getConversionTemplate() {
    const t = WineCalcI18n.t;

    return `
        <form id="calculatorForm" class="calculator-form">
            <div class="mb-3">
                <label for="value" class="form-label">${t('calculators.conversion.value')}</label>
                <input type="number" class="form-control" id="value" name="value"
                       step="0.0001" required>
            </div>

            <div class="mb-3">
                <label for="category" class="form-label">${t('calculators.conversion.category')}</label>
                <select class="form-select" id="category" name="category" required>
                    <option value="volume">${t('calculators.conversion.categories.volume')}</option>
                    <option value="weight">${t('calculators.conversion.categories.weight')}</option>
                    <option value="temperature">${t('calculators.conversion.categories.temperature')}</option>
                </select>
            </div>

            <div class="mb-3">
                <label for="fromUnit" class="form-label">${t('calculators.conversion.from')}</label>
                <select class="form-select" id="fromUnit" name="fromUnit" required>
                    <option value="liters">${t('calculators.conversion.units.liters')}</option>
                    <option value="hectoliters">${t('calculators.conversion.units.hectoliters')}</option>
                    <option value="gallons">${t('calculators.conversion.units.gallons')}</option>
                </select>
            </div>

            <div class="mb-3">
                <label for="toUnit" class="form-label">${t('calculators.conversion.to')}</label>
                <select class="form-select" id="toUnit" name="toUnit" required>
                    <option value="liters">${t('calculators.conversion.units.liters')}</option>
                    <option value="hectoliters">${t('calculators.conversion.units.hectoliters')}</option>
                    <option value="gallons">${t('calculators.conversion.units.gallons')}</option>
                </select>
            </div>

            <div id="errorContainer"></div>

            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <button type="reset" class="btn btn-outline-secondary">
                    <i class="bi bi-arrow-clockwise me-2"></i>${t('common.reset')}
                </button>
                <button type="submit" class="btn btn-wine">
                    <i class="bi bi-calculator me-2"></i>${t('common.calculate')}
                </button>
            </div>
        </form>

        <div id="resultsContainer"></div>
    `;
}

// Setup calculator form submit
function setupCalculatorForm(calculatorId) {
    const form = document.getElementById('calculatorForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateResult(calculatorId, form);
    });

    form.addEventListener('reset', () => {
        WineCalcUtils.clearMessages('errorContainer');
        document.getElementById('resultsContainer').innerHTML = '';
    });
}

// Calculate result
function calculateResult(calculatorId, form) {
    WineCalcUtils.clearMessages('errorContainer');

    const data = WineCalcUtils.getFormData(form);

    // Load and execute calculator
    const calculatorModule = `calculators/${calculatorId}.js`;

    if (typeof window[`calculate_${calculatorId}`] === 'function') {
        try {
            const result = window[`calculate_${calculatorId}`](data);
            displayResult(calculatorId, result);
        } catch (error) {
            console.error('Calculation error:', error);
            WineCalcUtils.showError(WineCalcI18n.t('errors.calculationError'), 'errorContainer');
        }
    } else {
        // Fallback: basic calculation
        performBasicCalculation(calculatorId, data);
    }
}

// Perform basic calculation (fallback)
function performBasicCalculation(calculatorId, data) {
    const result = {};

    switch (calculatorId) {
        case 'so2':
            result.amount = ((data.targetSO2 - data.currentSO2) * data.volume) / 570;
            break;
        case 'acid':
            result.amount = (data.targetTA - data.currentTA) * data.volume;
            break;
        case 'fortification':
            const spiritVolume = (data.volume * (data.targetAlcohol - data.currentAlcohol)) /
                                (data.spiritStrength - data.targetAlcohol);
            result.spiritVolume = spiritVolume;
            result.finalVolume = data.volume + spiritVolume;
            break;
        default:
            WineCalcUtils.showError('Calculator not implemented yet', 'errorContainer');
            return;
    }

    displayResult(calculatorId, result);
}

// Display calculation result
function displayResult(calculatorId, result) {
    const container = document.getElementById('resultsContainer');
    if (!container) return;

    const t = WineCalcI18n.t;

    let html = '<div class="results-section mt-4"><h5 class="mb-3">' + t('common.results') + '</h5>';

    for (let key in result) {
        const label = t(`calculators.${calculatorId}.results.${key}`) || key;
        const value = WineCalcUtils.formatNumber(result[key]);

        html += `
            <div class="result-item">
                <div class="result-label">${label}</div>
                <div class="result-value">${value} <span class="result-unit">${getUnit(calculatorId, key)}</span></div>
            </div>
        `;
    }

    html += '</div>';
    container.innerHTML = html;

    // Save result
    WineCalcUtils.saveResult(calculatorId, result);
}

// Get unit for result
function getUnit(calculatorId, resultKey) {
    const units = {
        so2: { amount: 'g', concentration: 'mg/L' },
        acid: { amount: 'g', finalTA: 'g/L' },
        fortification: { spiritVolume: 'L', finalVolume: 'L', finalAlcohol: '%vol' },
        conversion: { converted: '' }
    };

    return units[calculatorId]?.[resultKey] || '';
}

// Setup modal close listener
function setupModalCloseListener() {
    const modalElement = document.getElementById('calculatorModal');
    if (modalElement) {
        modalElement.addEventListener('hidden.bs.modal', () => {
            AppState.currentCalculator = null;
            document.getElementById('calculatorContent').innerHTML = '';
        });
    }
}

// Listen for language change
window.addEventListener('languageChanged', () => {
    console.log('Language changed, reloading calculator if open');
    if (AppState.currentCalculator) {
        loadCalculatorContent(AppState.currentCalculator);
    }
});

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
