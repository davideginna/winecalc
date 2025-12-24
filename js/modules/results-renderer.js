/* WineCalc - Results Renderer */

/**
 * Renders calculation results in a user-friendly format
 */
export const ResultsRenderer = {
    resultsConfigCache: {},

    /**
     * Load results configuration for a calculator
     */
    async loadResultsConfig(calculatorId) {
        // Check cache
        if (this.resultsConfigCache[calculatorId]) {
            return this.resultsConfigCache[calculatorId];
        }

        try {
            const response = await fetch(`js/calculators-fields/${calculatorId}.json`);
            if (!response.ok) {
                return null;
            }
            const config = await response.json();
            const resultsConfig = config.results || null;
            this.resultsConfigCache[calculatorId] = resultsConfig;
            return resultsConfig;
        } catch (error) {
            console.warn(`No results config for ${calculatorId}, using defaults`);
            return null;
        }
    },

    /**
     * Render calculation results
     */
    async render(calculatorId, result) {
        // Ensure calculator translations are loaded
        const currentLang = WineCalcI18n.getCurrentLanguage();
        await WineCalcI18n.loadCalculatorTranslations(calculatorId, currentLang);

        const container = document.getElementById('resultsContainer');
        if (!container) {
            console.error('Results container not found');
            return;
        }

        const html = await this.generateResultsHTML(calculatorId, result);
        container.innerHTML = html;

        // Animate results appearing
        container.classList.add('fade-in');
        setTimeout(() => container.classList.remove('fade-in'), 500);

        console.log('Results rendered:', result);
    },

    /**
     * Generate HTML for results
     */
    async generateResultsHTML(calculatorId, result) {
        const t = WineCalcI18n.t;

        // Load results configuration
        const resultsConfig = await this.loadResultsConfig(calculatorId);

        // Check if formula exists
        const hasFormula = resultsConfig && resultsConfig.formula;

        let html = `
            <div class="results-section mt-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="mb-0">
                        <i class="bi bi-check-circle-fill text-success me-2"></i>
                        ${t('common.results')}
                    </h5>
                    <div class="btn-group btn-group-sm" role="group">
                        ${hasFormula ? `
                            <button class="btn btn-outline-secondary" onclick="ResultsRenderer.toggleFormula()">
                                <i class="bi bi-calculator"></i> <span id="formulaToggleText">${t('common.showFormula')}</span>
                            </button>
                        ` : ''}
                        <button class="btn btn-outline-secondary" onclick="ResultsRenderer.copyResults('${calculatorId}')">
                            <i class="bi bi-clipboard"></i> ${t('common.copy')}
                        </button>
                    </div>
                </div>

                ${hasFormula ? this.renderFormula(calculatorId, t) : ''}
        `;

        // Determine order of fields
        let fieldsToRender = [];

        if (resultsConfig && resultsConfig.order) {
            // Use configured order
            fieldsToRender = resultsConfig.order;
        } else {
            // Use all fields from result object
            fieldsToRender = Object.keys(result).filter(key =>
                !this.shouldSkipField(key, result[key])
            );
        }

        // Render each result item in configured order
        for (let key of fieldsToRender) {
            const value = result[key];

            // Skip if field doesn't exist in result
            if (value === undefined || value === null) {
                continue;
            }

            // Skip certain meta fields
            if (this.shouldSkipField(key, value)) {
                continue;
            }

            html += this.renderResultItem(calculatorId, key, value, resultsConfig);
        }

        html += '</div>';

        return html;
    },

    /**
     * Check if field should be skipped in display
     */
    shouldSkipField(key, value) {
        // Skip booleans, objects, arrays, and internal fields
        const skipTypes = ['boolean', 'object', 'function'];
        const skipKeys = ['isLegal', 'isRecommended', 'isWithinRecommendation', 'hasSufficientSO2'];

        if (skipTypes.includes(typeof value)) {
            return true;
        }

        if (skipKeys.includes(key)) {
            return true;
        }

        return false;
    },

    /**
     * Render a single result item
     */
    renderResultItem(calculatorId, key, value, resultsConfig) {
        const label = this.getResultLabel(calculatorId, key);
        const displayValue = this.formatResultValue(value, calculatorId, key, resultsConfig);
        const unit = this.getResultUnit(calculatorId, key, resultsConfig);

        return `
            <div class="result-item">
                <div class="result-label">${label}</div>
                <div class="result-value">
                    ${displayValue}
                    ${unit ? `<span class="result-unit">${unit}</span>` : ''}
                </div>
            </div>
        `;
    },

    /**
     * Get translated label for result key
     */
    getResultLabel(calculatorId, key) {
        const t = WineCalcI18n.t;

        // Try calculator-specific translation
        const translated = t(`results.${key}`, { ns: calculatorId, defaultValue: null });

        if (translated) {
            return translated;
        }

        // Fallback: format key as readable text
        return this.formatKeyAsLabel(key);
    },

    /**
     * Format key as human-readable label
     */
    formatKeyAsLabel(key) {
        // Convert camelCase to Title Case with spaces
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    },

    /**
     * Format result value for display
     */
    formatResultValue(value, calculatorId, key, resultsConfig) {
        if (typeof value === 'number') {
            // Check if there's a specific decimal config for this field
            if (resultsConfig && resultsConfig.decimals && resultsConfig.decimals[key] !== undefined) {
                const decimals = resultsConfig.decimals[key];
                return value.toFixed(decimals);
            }
            return WineCalcUtils.formatNumber(value);
        }

        if (typeof value === 'string') {
            return value;
        }

        if (Array.isArray(value)) {
            return value.join(', ');
        }

        return String(value);
    },

    /**
     * Get unit for result
     */
    getResultUnit(calculatorId, resultKey, resultsConfig) {
        // First, try to get unit from config
        if (resultsConfig && resultsConfig.units && resultsConfig.units[resultKey]) {
            return resultsConfig.units[resultKey];
        }

        // Fallback to hardcoded units (for backwards compatibility)
        const units = {
            so2: {
                amount: 'g',
                concentration: 'mg/L',
                freeSO2: 'mg/L',
                molecularSO2: 'mg/L'
            },
            acid: {
                amountKg: 'kg',
                amountG: 'g',
                additionRate: 'g/L',
                volume: 'L'
            },
            bentonite: {
                bentoniteAmount: 'g',
                bentoniteAmountKg: 'kg',
                waterAmount: 'mL',
                waterAmountL: 'L',
                settlingTime: 'giorni',
                proteinRemoval: '%'
            },
            fortification: {
                spiritVolume: 'L',
                finalVolume: 'L',
                finalAlcohol: '%vol',
                currentAlcohol: '%vol',
                targetAlcohol: '%vol'
            },
            water: {
                waterVolume: 'L',
                finalVolume: 'L',
                finalConcentration: '',
                dilutionPercent: '%'
            },
            conversion: {
                converted: '',
                originalValue: '',
                originalUnit: '',
                targetUnit: ''
            },
            dap: {
                dapAmount: 'g',
                dapAmountKg: 'kg',
                dosageRate: 'g/hL',
                nitrogenAdded: 'mg/L',
                finalYAN: 'mg/L'
            },
            ascorbic_acid: {
                ascorbicAmount: 'g',
                ascorbicAmountMg: 'mg',
                dosageRate: 'g/hL',
                concentrationMgL: 'mg/L',
                currentSO2: 'mg/L',
                estimatedSO2Consumption: 'mg/L',
                estimatedFinalSO2: 'mg/L'
            }
        };

        return units[calculatorId]?.[resultKey] || '';
    },

    /**
     * Copy results to clipboard
     */
    copyResults(calculatorId) {
        const container = document.getElementById('resultsContainer');
        if (!container) return;

        const resultItems = container.querySelectorAll('.result-item');
        let text = `WineCalc - ${calculatorId}\n\n`;

        resultItems.forEach(item => {
            const label = item.querySelector('.result-label')?.textContent || '';
            const value = item.querySelector('.result-value')?.textContent || '';
            text += `${label}: ${value}\n`;
        });

        text += `\n${new Date().toLocaleString()}`;

        navigator.clipboard.writeText(text).then(() => {
            WineCalcUtils.showSuccess(
                WineCalcI18n.t('common.copied') || 'Copied to clipboard',
                'errorContainer'
            );
        }).catch(err => {
            console.error('Copy failed:', err);
        });
    },

    /**
     * Export results as JSON
     */
    exportAsJSON(calculatorId, result) {
        const data = {
            calculator: calculatorId,
            timestamp: new Date().toISOString(),
            results: result
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `winecalc_${calculatorId}_${Date.now()}.json`;
        a.click();

        URL.revokeObjectURL(url);
    },

    /**
     * Print results
     */
    printResults() {
        window.print();
    },

    /**
     * Render formula section
     */
    renderFormula(calculatorId, t) {
        const formulaData = t('formula', { ns: calculatorId, returnObjects: true, defaultValue: null });

        if (!formulaData || typeof formulaData === 'string') {
            return '';
        }

        const description = formulaData.description || 'Formula';
        const steps = formulaData.steps || [];

        return `
            <div id="formulaSection" class="alert alert-light border mb-3" style="display: none;">
                <h6 class="mb-2"><i class="bi bi-calculator me-2"></i>${description}</h6>
                ${steps.map((step, i) => `
                    <div class="font-monospace small mb-1">${i + 1}. ${step}</div>
                `).join('')}
            </div>
        `;
    },

    /**
     * Toggle formula visibility
     */
    toggleFormula() {
        const formulaSection = document.getElementById('formulaSection');
        const toggleText = document.getElementById('formulaToggleText');
        const t = WineCalcI18n.t;

        if (formulaSection) {
            if (formulaSection.style.display === 'none') {
                formulaSection.style.display = 'block';
                if (toggleText) toggleText.textContent = t('common.hideFormula');
            } else {
                formulaSection.style.display = 'none';
                if (toggleText) toggleText.textContent = t('common.showFormula');
            }
        }
    }
};

// Expose to window for onclick handlers
window.ResultsRenderer = ResultsRenderer;
