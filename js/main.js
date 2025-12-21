/* WineCalc - Main Entry Point (ES6 Module) */

// Import core modules
import { StateManager } from './modules/app-state.js';
import { SearchManager } from './modules/search-manager.js';
import { TemplateGenerator } from './modules/template-generator.js';
import { FormHandler } from './modules/form-handler.js';
import { ResultsRenderer } from './modules/results-renderer.js';
import { CalculatorManager } from './modules/calculator-manager.js';

/**
 * Main application orchestrator
 */
const WineCalcApp = {
    /**
     * Initialize the entire application
     */
    async initialize() {
        console.log('=== WineCalc Application Starting ===');

        // Wait for DOM and dependencies to be ready
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

        // Wait for global dependencies (i18n, utils, etc.)
        await this.waitForDependencies();

        // Initialize app
        this.init();
    },

    /**
     * Wait for global dependencies to load
     */
    async waitForDependencies() {
        const maxWait = 5000; // 5 seconds max
        const startTime = Date.now();

        while (!window.WineCalcUtils || !window.WineCalcI18n) {
            if (Date.now() - startTime > maxWait) {
                throw new Error('Dependencies failed to load');
            }
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        console.log('✓ Dependencies loaded');
    },

    /**
     * Initialize all modules
     */
    init() {
        console.log('Initializing WineCalc modules...');

        try {
            // Initialize modules in order of dependency
            StateManager.initialize();
            console.log('  ✓ State Manager');

            SearchManager.initialize();
            console.log('  ✓ Search Manager');

            CalculatorManager.initialize();
            console.log('  ✓ Calculator Manager');

            // Setup global event listeners
            this.setupGlobalListeners();

            // Expose to window for debugging
            window.WineCalcApp = this;
            window.StateManager = StateManager;
            window.CalculatorManager = CalculatorManager;
            window.TemplateGenerator = TemplateGenerator;
            window.FormHandler = FormHandler;
            window.ResultsRenderer = ResultsRenderer;

            console.log('✓ WineCalc application initialized successfully');
            console.log('💡 Type debugWineCalc() in console for debug info');

        } catch (error) {
            console.error('× Error initializing application:', error);
            this.showErrorMessage(error);
        }
    },

    /**
     * Setup global event listeners
     */
    setupGlobalListeners() {
        // Listen for language changes and reload current calculator
        window.addEventListener('languageChanged', (e) => {
            console.log(`Language changed to: ${e.detail.language}`);
            CalculatorManager.reloadCurrentCalculator();
        });

        // Listen for theme changes
        window.addEventListener('themeChanged', (e) => {
            console.log(`Theme changed:`, e.detail);
        });
    },

    /**
     * Show error message to user
     */
    showErrorMessage(error) {
        const errorHtml = `
            <div class="alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3"
                 style="z-index: 9999; max-width: 500px;" role="alert">
                <strong>Errore di inizializzazione</strong><br>
                ${error.message || 'Errore sconosciuto'}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

        document.body.insertAdjacentHTML('afterbegin', errorHtml);
    },

    /**
     * Debug info
     */
    debug() {
        console.group('🔍 WineCalc Debug Info');
        console.log('Modules:', {
            StateManager: typeof StateManager !== 'undefined',
            SearchManager: typeof SearchManager !== 'undefined',
            CalculatorManager: typeof CalculatorManager !== 'undefined',
            TemplateGenerator: typeof TemplateGenerator !== 'undefined',
            FormHandler: typeof FormHandler !== 'undefined',
            ResultsRenderer: typeof ResultsRenderer !== 'undefined'
        });
        console.log('Global Dependencies:', {
            WineCalcUtils: typeof window.WineCalcUtils !== 'undefined',
            WineCalcI18n: typeof window.WineCalcI18n !== 'undefined',
            ThemeManager: typeof window.ThemeManager !== 'undefined',
            bootstrap: typeof window.bootstrap !== 'undefined'
        });
        console.groupEnd();
    }
};

// Expose debug function
window.debugWineCalc = () => WineCalcApp.debug();

// Start the application
WineCalcApp.initialize();
