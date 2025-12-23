/* WineCalc - Form Handler */

import { StateManager } from './app-state.js';
import { ResultsRenderer } from './results-renderer.js';

/**
 * Handles calculator form submission and validation
 */
export const FormHandler = {
    /**
     * Setup form event listeners
     */
    setupForm(calculatorId) {
        const form = document.getElementById('calculatorForm');
        if (!form) {
            console.warn('Calculator form not found');
            return;
        }

        // Submit handler
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(calculatorId, form);
        });

        // Reset handler
        form.addEventListener('reset', () => {
            this.handleReset();
        });

        console.log(`Form handlers setup for: ${calculatorId}`);
    },

    /**
     * Handle form submission
     */
    handleSubmit(calculatorId, form) {
        // Clear previous messages
        WineCalcUtils.clearMessages('errorContainer');

        // Get form data
        const data = WineCalcUtils.getFormData(form);

        // Convert numeric strings to numbers
        const numericData = this.convertToNumbers(data);

        // Execute calculation
        this.executeCalculation(calculatorId, numericData);
    },

    /**
     * Convert form data strings to numbers where appropriate
     */
    convertToNumbers(data) {
        const converted = {};

        for (let key in data) {
            const value = data[key];

            // Try to convert to number if it looks like a number
            if (value !== '' && !isNaN(value)) {
                converted[key] = parseFloat(value);
            } else {
                converted[key] = value;
            }
        }

        return converted;
    },

    /**
     * Execute calculator calculation
     */
    async executeCalculation(calculatorId, data) {
        const calculatorFunction = window[`calculate_${calculatorId}`];

        if (typeof calculatorFunction === 'function') {
            try {
                // Call calculator function
                const result = calculatorFunction(data);

                // Display results (now async)
                await ResultsRenderer.render(calculatorId, result);

                // Add to history
                StateManager.addToHistory(calculatorId, data, result);

                console.log(`Calculation successful:`, result);

            } catch (error) {
                console.error('Calculation error:', error);
                this.handleCalculationError(error);
            }
        } else {
            // Calculator not implemented - try fallback
            console.warn(`Calculator "${calculatorId}" not implemented, using fallback`);
            await this.fallbackCalculation(calculatorId, data);
        }
    },

    /**
     * Handle calculation errors
     */
    handleCalculationError(error) {
        const errorMessage = error.message ||
                           WineCalcI18n.t('errors.calculationError') ||
                           'Calculation error';

        WineCalcUtils.showError(errorMessage, 'errorContainer');
    },

    /**
     * Fallback calculation for basic calculators
     */
    async fallbackCalculation(calculatorId, data) {
        const result = {};

        try {
            switch (calculatorId) {
                case 'so2':
                    result.amount = ((data.targetSO2 - data.currentSO2) * data.volume) / 570;
                    result.concentration = data.targetSO2;
                    break;

                case 'acid':
                    result.amount = (data.targetTA - data.currentTA) * data.volume;
                    result.finalTA = data.targetTA;
                    break;

                case 'fortification':
                    const spiritVolume = (data.volume * (data.targetAlcohol - data.currentAlcohol)) /
                                        (data.spiritStrength - data.targetAlcohol);
                    result.spiritVolume = spiritVolume;
                    result.finalVolume = data.volume + spiritVolume;
                    result.finalAlcohol = data.targetAlcohol;
                    break;

                default:
                    throw new Error(`Calculator "${calculatorId}" not implemented`);
            }

            await ResultsRenderer.render(calculatorId, result);
            StateManager.addToHistory(calculatorId, data, result);

        } catch (error) {
            this.handleCalculationError(error);
        }
    },

    /**
     * Handle form reset
     */
    handleReset() {
        // Clear messages
        WineCalcUtils.clearMessages('errorContainer');

        // Clear results
        const resultsContainer = document.getElementById('resultsContainer');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }

        console.log('Form reset');
    },

    /**
     * Validate form data (can be extended for complex validation)
     */
    validateData(data, rules) {
        const errors = [];

        for (let field in rules) {
            const rule = rules[field];
            const value = data[field];

            if (rule.required && (!value && value !== 0)) {
                errors.push(`${field} is required`);
            }

            if (rule.min !== undefined && value < rule.min) {
                errors.push(`${field} must be at least ${rule.min}`);
            }

            if (rule.max !== undefined && value > rule.max) {
                errors.push(`${field} must be at most ${rule.max}`);
            }

            if (rule.type === 'number' && isNaN(value)) {
                errors.push(`${field} must be a number`);
            }
        }

        return errors;
    }
};

