/* WineCalc - Template Generator */

/**
 * Generates HTML templates for calculator forms
 */
export const TemplateGenerator = {
    /**
     * Generate template for calculator
     */
    generate(calculatorId) {
        const generators = {
            'so2': this.getSO2Template,
            'acid': this.getAcidTemplate,
            'bentonite': this.getBentoniteTemplate,
            'fortification': this.getFortificationTemplate,
            'water': this.getWaterTemplate,
            'conversion': this.getConversionTemplate,
            'dap': this.getDAPTemplate,
            'ascorbic_acid': this.getAscorbicAcidTemplate
        };

        const generator = generators[calculatorId];

        if (generator) {
            return generator.call(this);
        } else {
            return this.getComingSoonTemplate(calculatorId);
        }
    },

    /**
     * Get "coming soon" template for not-yet-implemented calculators
     */
    getComingSoonTemplate(calculatorId) {
        const t = WineCalcI18n.t;

        return `
            <div class="alert alert-info">
                <i class="bi bi-hourglass-split me-2"></i>
                <strong>${t('common.comingSoon') || 'Coming soon...'}</strong>
            </div>
            <p>${t(`calculators.${calculatorId}.description`) || 'This calculator is under development.'}</p>
            <p class="text-muted small">
                ${t(`calculators.${calculatorId}.info`) || ''}
            </p>
        `;
    },

    /**
     * SO2 Calculator Template
     */
    getSO2Template() {
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
                           min="0" step="0.1" placeholder="100" required>
                </div>

                <div class="mb-3">
                    <label for="currentSO2" class="form-label">${t('calculators.so2.currentSO2')}</label>
                    <input type="number" class="form-control" id="currentSO2" name="currentSO2"
                           min="0" step="1" placeholder="20" required>
                </div>

                <div class="mb-3">
                    <label for="targetSO2" class="form-label">${t('calculators.so2.targetSO2')}</label>
                    <input type="number" class="form-control" id="targetSO2" name="targetSO2"
                           min="0" step="1" placeholder="50" required>
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

                ${this.getFormButtons()}
            </form>

            <div id="resultsContainer"></div>
        `;
    },

    /**
     * Acid Calculator Template
     */
    getAcidTemplate() {
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
                           min="0" step="0.1" placeholder="100" required>
                </div>

                <div class="mb-3">
                    <label for="currentTA" class="form-label">${t('calculators.acid.currentTA')}</label>
                    <input type="number" class="form-control" id="currentTA" name="currentTA"
                           min="0" step="0.1" placeholder="5.0" required>
                </div>

                <div class="mb-3">
                    <label for="targetTA" class="form-label">${t('calculators.acid.targetTA')}</label>
                    <input type="number" class="form-control" id="targetTA" name="targetTA"
                           min="0" step="0.1" placeholder="6.5" required>
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

                ${this.getFormButtons()}
            </form>

            <div id="resultsContainer"></div>
        `;
    },

    /**
     * Bentonite Calculator Template
     */
    getBentoniteTemplate() {
        const t = WineCalcI18n.t;

        return `
            <div class="alert alert-info mb-4">
                <i class="bi bi-info-circle me-2"></i>
                ${t('calculators.bentonite.info')}
            </div>

            <form id="calculatorForm" class="calculator-form">
                <div class="mb-3">
                    <label for="volume" class="form-label">${t('calculators.bentonite.volume')}</label>
                    <input type="number" class="form-control" id="volume" name="volume"
                           min="0" step="0.1" placeholder="100" required>
                </div>

                <div class="mb-3">
                    <label for="dosage" class="form-label">${t('calculators.bentonite.dosage')}</label>
                    <input type="number" class="form-control" id="dosage" name="dosage"
                           min="0" step="1" placeholder="30" required>
                    <div class="form-text">Tipico: 20-80 g/hL</div>
                </div>

                <div id="errorContainer"></div>

                ${this.getFormButtons()}
            </form>

            <div id="resultsContainer"></div>
        `;
    },

    /**
     * Fortification Calculator Template
     */
    getFortificationTemplate() {
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
                           min="0" step="0.1" placeholder="100" required>
                </div>

                <div class="mb-3">
                    <label for="currentAlcohol" class="form-label">${t('calculators.fortification.currentAlcohol')}</label>
                    <input type="number" class="form-control" id="currentAlcohol" name="currentAlcohol"
                           min="0" max="100" step="0.1" placeholder="12.5" required>
                </div>

                <div class="mb-3">
                    <label for="targetAlcohol" class="form-label">${t('calculators.fortification.targetAlcohol')}</label>
                    <input type="number" class="form-control" id="targetAlcohol" name="targetAlcohol"
                           min="0" max="100" step="0.1" placeholder="18.0" required>
                </div>

                <div class="mb-3">
                    <label for="spiritStrength" class="form-label">${t('calculators.fortification.spiritStrength')}</label>
                    <input type="number" class="form-control" id="spiritStrength" name="spiritStrength"
                           min="0" max="100" step="0.1" value="96" required>
                </div>

                <div id="errorContainer"></div>

                ${this.getFormButtons()}
            </form>

            <div id="resultsContainer"></div>
        `;
    },

    /**
     * Water Addition Template
     */
    getWaterTemplate() {
        const t = WineCalcI18n.t;

        return `
            <div class="alert alert-warning mb-4">
                <i class="bi bi-exclamation-triangle me-2"></i>
                ${t('calculators.water.info')}
            </div>

            <form id="calculatorForm" class="calculator-form">
                <div class="mb-3">
                    <label for="volume" class="form-label">${t('calculators.water.volume')}</label>
                    <input type="number" class="form-control" id="volume" name="volume"
                           min="0" step="0.1" placeholder="100" required>
                </div>

                <div class="mb-3">
                    <label for="currentValue" class="form-label">${t('calculators.water.currentValue')}</label>
                    <input type="number" class="form-control" id="currentValue" name="currentValue"
                           min="0" step="0.1" placeholder="14.5" required>
                </div>

                <div class="mb-3">
                    <label for="targetValue" class="form-label">${t('calculators.water.targetValue')}</label>
                    <input type="number" class="form-control" id="targetValue" name="targetValue"
                           min="0" step="0.1" placeholder="13.0" required>
                </div>

                <div class="mb-3">
                    <label for="parameter" class="form-label">${t('calculators.water.parameter')}</label>
                    <select class="form-select" id="parameter" name="parameter" required>
                        <option value="alcohol">Alcohol (%vol)</option>
                        <option value="acidity">Total Acidity (g/L)</option>
                        <option value="sugar">Sugar (g/L)</option>
                    </select>
                </div>

                <div id="errorContainer"></div>

                ${this.getFormButtons()}
            </form>

            <div id="resultsContainer"></div>
        `;
    },

    /**
     * Conversion Calculator Template
     */
    getConversionTemplate() {
        const t = WineCalcI18n.t;

        return `
            <form id="calculatorForm" class="calculator-form">
                <div class="mb-3">
                    <label for="value" class="form-label">${t('calculators.conversion.value')}</label>
                    <input type="number" class="form-control" id="value" name="value"
                           step="0.0001" placeholder="100" required>
                </div>

                <div class="mb-3">
                    <label for="category" class="form-label">${t('calculators.conversion.category')}</label>
                    <select class="form-select" id="category" name="category" required>
                        <option value="volume">${t('calculators.conversion.categories.volume')}</option>
                        <option value="weight">${t('calculators.conversion.categories.weight')}</option>
                        <option value="temperature">${t('calculators.conversion.categories.temperature')}</option>
                        <option value="density">${t('calculators.conversion.categories.density')}</option>
                        <option value="alcohol">${t('calculators.conversion.categories.alcohol')}</option>
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

                ${this.getFormButtons()}
            </form>

            <div id="resultsContainer"></div>
        `;
    },

    /**
     * DAP Calculator Template
     */
    getDAPTemplate() {
        const t = WineCalcI18n.t;

        return `
            <div class="alert alert-info mb-4">
                <i class="bi bi-info-circle me-2"></i>
                Nutrimento azotato per lieviti. Dosaggio tipico: 20-40 g/hL
            </div>

            <form id="calculatorForm" class="calculator-form">
                <div class="mb-3">
                    <label for="volume" class="form-label">Volume (L)</label>
                    <input type="number" class="form-control" id="volume" name="volume"
                           min="0" step="0.1" placeholder="100" required>
                </div>

                <div class="mb-3">
                    <label for="dosage" class="form-label">Dosaggio (g/hL)</label>
                    <input type="number" class="form-control" id="dosage" name="dosage"
                           min="0" step="1" placeholder="30">
                    <div class="form-text">Oppure calcola da YAN</div>
                </div>

                <div class="mb-3">
                    <label for="yeastAssimilableNitrogen" class="form-label">YAN Attuale (mg/L)</label>
                    <input type="number" class="form-control" id="yeastAssimilableNitrogen" name="yeastAssimilableNitrogen"
                           min="0" step="1" placeholder="120">
                </div>

                <div class="mb-3">
                    <label for="targetYAN" class="form-label">YAN Desiderato (mg/L)</label>
                    <input type="number" class="form-control" id="targetYAN" name="targetYAN"
                           min="0" step="1" placeholder="200">
                </div>

                <div id="errorContainer"></div>

                ${this.getFormButtons()}
            </form>

            <div id="resultsContainer"></div>
        `;
    },

    /**
     * Ascorbic Acid Template
     */
    getAscorbicAcidTemplate() {
        const t = WineCalcI18n.t;

        return `
            <div class="alert alert-warning mb-4">
                <i class="bi bi-exclamation-triangle me-2"></i>
                <strong>IMPORTANTE:</strong> L'acido ascorbico deve essere usato INSIEME ad SO2 adeguato!
            </div>

            <form id="calculatorForm" class="calculator-form">
                <div class="mb-3">
                    <label for="volume" class="form-label">Volume (L)</label>
                    <input type="number" class="form-control" id="volume" name="volume"
                           min="0" step="0.1" placeholder="100" required>
                </div>

                <div class="mb-3">
                    <label for="dosage" class="form-label">Dosaggio (g/hL)</label>
                    <input type="number" class="form-control" id="dosage" name="dosage"
                           min="0" step="1" placeholder="10" required>
                    <div class="form-text">Tipico: 5-20 g/hL</div>
                </div>

                <div class="mb-3">
                    <label for="currentSO2" class="form-label">SO2 Libera Attuale (mg/L)</label>
                    <input type="number" class="form-control" id="currentSO2" name="currentSO2"
                           min="0" step="1" placeholder="30">
                    <div class="form-text">Minimo raccomandato: 20 mg/L</div>
                </div>

                <div id="errorContainer"></div>

                ${this.getFormButtons()}
            </form>

            <div id="resultsContainer"></div>
        `;
    },

    /**
     * Get standard form buttons (Calculate + Reset)
     */
    getFormButtons() {
        const t = WineCalcI18n.t;

        return `
            <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                <button type="reset" class="btn btn-outline-secondary">
                    <i class="bi bi-arrow-clockwise me-2"></i>${t('common.reset')}
                </button>
                <button type="submit" class="btn btn-wine">
                    <i class="bi bi-calculator me-2"></i>${t('common.calculate')}
                </button>
            </div>
        `;
    }
};

