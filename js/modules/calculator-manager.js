/* WineCalc - Calculator Manager */

import { AppState, StateManager } from './app-state.js';
import { TemplateGenerator } from './template-generator.js';
import { FormHandler } from './form-handler.js';
import { CalculatorLoader } from './calculator-loader.js';

/**
 * Manages calculator lifecycle: loading, opening, closing
 */
export const CalculatorManager = {
    /**
     * Initialize calculator manager
     */
    async initialize() {
        // Initialize Bootstrap modal
        const modalElement = document.getElementById('calculatorModal');
        if (modalElement) {
            StateManager.updateState('modal', new bootstrap.Modal(modalElement));
            this.setupModalListeners(modalElement);
        } else {
            console.error('Calculator modal not found');
        }

        // Setup calculator links
        this.setupCalculatorLinks();

        console.log('Calculator manager initialized');
    },

    /**
     * Setup click listeners on calculator cards
     */
    setupCalculatorLinks() {
        document.querySelectorAll('.calculator-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const calculatorId = e.currentTarget.dataset.calculator;
                this.openCalculator(calculatorId);
            });
        });
    },

    /**
     * Open calculator in modal
     */
    async openCalculator(calculatorId) {
        console.log(`Opening calculator: ${calculatorId}`);

        // Update state
        StateManager.updateState('currentCalculator', calculatorId);

        // Lazy load calculator module if not already loaded
        if (!CalculatorLoader.isCalculatorLoaded(calculatorId)) {
            console.log(`Lazy loading calculator module: ${calculatorId}`);
            const loaded = await CalculatorLoader.loadCalculatorModule(calculatorId);
            if (!loaded) {
                console.error(`Failed to load calculator: ${calculatorId}`);
                // Continue anyway, fallback will handle it
            }
        }

        // Load calculator content
        await this.loadCalculatorContent(calculatorId);

        // Show modal
        const modal = AppState.modal;
        if (modal) {
            modal.show();
        } else {
            console.error('Modal not initialized');
        }
    },

    /**
     * Load calculator content into modal
     */
    async loadCalculatorContent(calculatorId) {
        const content = document.getElementById('calculatorContent');
        const modalLabel = document.getElementById('calculatorModalLabel');

        if (!content) {
            console.error('Calculator content container not found');
            return;
        }

        // Update modal title
        if (modalLabel) {
            modalLabel.textContent = WineCalcI18n.t(`calculators.${calculatorId}.title`);
        }

        // Generate calculator HTML (now async)
        const html = await TemplateGenerator.generate(calculatorId);
        content.innerHTML = html;

        // Setup form handlers
        FormHandler.setupForm(calculatorId);
    },

    /**
     * Close calculator and clean up
     */
    closeCalculator() {
        const modal = AppState.modal;
        if (modal) {
            modal.hide();
        }

        this.cleanupCalculator();
    },

    /**
     * Cleanup calculator content
     */
    cleanupCalculator() {
        StateManager.updateState('currentCalculator', null);

        const content = document.getElementById('calculatorContent');
        if (content) {
            content.innerHTML = '';
        }

        // Clear any results or errors
        const resultsContainer = document.getElementById('resultsContainer');
        const errorContainer = document.getElementById('errorContainer');

        if (resultsContainer) resultsContainer.innerHTML = '';
        if (errorContainer) errorContainer.innerHTML = '';
    },

    /**
     * Setup modal event listeners
     */
    setupModalListeners(modalElement) {
        // When modal is hidden, cleanup
        modalElement.addEventListener('hidden.bs.modal', () => {
            this.cleanupCalculator();
        });

        // When modal is shown, focus first input
        modalElement.addEventListener('shown.bs.modal', () => {
            const firstInput = modalElement.querySelector('input:not([type="hidden"]), select');
            if (firstInput) {
                firstInput.focus();
            }
        });
    },

    /**
     * Reload current calculator (e.g., after language change)
     */
    async reloadCurrentCalculator() {
        const currentCalc = AppState.currentCalculator;
        if (currentCalc) {
            console.log(`Reloading calculator: ${currentCalc}`);
            await this.loadCalculatorContent(currentCalc);
        }
    },

    /**
     * Check if calculator module is available
     */
    isCalculatorAvailable(calculatorId) {
        // Convert hyphens to underscores for function name (e.g., "ascorbic-acid" -> "ascorbic_acid")
        const functionName = calculatorId.replace(/-/g, '_');
        return typeof window[`calculate_${functionName}`] === 'function';
    },

    /**
     * Get list of available calculators
     */
    getAvailableCalculators() {
        const cards = document.querySelectorAll('.calculator-link');
        return Array.from(cards).map(link => link.dataset.calculator);
    },

    /**
     * Get list of implemented calculators (with JS modules)
     */
    getImplementedCalculators() {
        return this.getAvailableCalculators().filter(id =>
            this.isCalculatorAvailable(id)
        );
    }
};

