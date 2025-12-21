/* WineCalc - Results Renderer */

/**
 * Renders calculation results in a user-friendly format
 */
export const ResultsRenderer = {
    /**
     * Render calculation results
     */
    render(calculatorId, result) {
        const container = document.getElementById('resultsContainer');
        if (!container) {
            console.error('Results container not found');
            return;
        }

        const html = this.generateResultsHTML(calculatorId, result);
        container.innerHTML = html;

        // Animate results appearing
        container.classList.add('fade-in');
        setTimeout(() => container.classList.remove('fade-in'), 500);

        console.log('Results rendered:', result);
    },

    /**
     * Generate HTML for results
     */
    generateResultsHTML(calculatorId, result) {
        const t = WineCalcI18n.t;

        let html = `
            <div class="results-section mt-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="mb-0">
                        <i class="bi bi-check-circle-fill text-success me-2"></i>
                        ${t('common.results')}
                    </h5>
                    <button class="btn btn-sm btn-outline-secondary" onclick="ResultsRenderer.copyResults('${calculatorId}')">
                        <i class="bi bi-clipboard"></i> ${t('common.copy') || 'Copy'}
                    </button>
                </div>
        `;

        // Render each result item
        for (let key in result) {
            const value = result[key];

            // Skip certain meta fields
            if (this.shouldSkipField(key, value)) {
                continue;
            }

            html += this.renderResultItem(calculatorId, key, value);
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
    renderResultItem(calculatorId, key, value) {
        const label = this.getResultLabel(calculatorId, key);
        const displayValue = this.formatResultValue(value);
        const unit = this.getResultUnit(calculatorId, key);

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
        const specificKey = `calculators.${calculatorId}.results.${key}`;
        const translated = t(specificKey);

        if (translated && translated !== specificKey) {
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
    formatResultValue(value) {
        if (typeof value === 'number') {
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
    getResultUnit(calculatorId, resultKey) {
        const units = {
            so2: {
                amount: 'g',
                concentration: 'mg/L',
                freeSO2: 'mg/L',
                molecularSO2: 'mg/L'
            },
            acid: {
                amount: 'g',
                finalTA: 'g/L',
                currentTA: 'g/L',
                targetTA: 'g/L'
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
    }
};

// Expose to window for onclick handlers
window.ResultsRenderer = ResultsRenderer;
