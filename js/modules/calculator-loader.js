/* WineCalc - Calculator Loader & Dynamic Card Generator */

/**
 * Handles dynamic loading of calculators from config
 */
export const CalculatorLoader = {
    config: null,
    loadedModules: new Set(),

    /**
     * Initialize: load config and generate cards
     */
    async initialize() {
        try {
            await this.loadConfig();
            await this.generateCards();
            console.log('Calculator loader initialized');
        } catch (error) {
            console.error('Error initializing calculator loader:', error);
        }
    },

    /**
     * Load calculators configuration from JSON
     */
    async loadConfig() {
        try {
            const response = await fetch('calculators-config.json');
            if (!response.ok) {
                throw new Error('Failed to load calculators config');
            }
            this.config = await response.json();
            console.log(`Loaded ${this.config.calculators.length} calculator definitions`);
        } catch (error) {
            console.error('Error loading config:', error);
            // Fallback to empty config
            this.config = { calculators: [] };
        }
    },

    /**
     * Generate calculator cards dynamically
     */
    async generateCards() {
        const categories = {
            chemical: document.querySelector('#chemical-calculators .row'),
            specialized: document.querySelector('#specialized-calculators .row'),
            reference: document.querySelector('#reference-calculators .row'),
            sensory: document.querySelector('#sensory-calculators .row'),
            additional: document.querySelector('#additional-calculators .row')
        };

        // Filter enabled calculators and sort by priority
        const enabledCalcs = this.config.calculators
            .filter(calc => calc.enabled)
            .sort((a, b) => a.priority - b.priority);

        // Generate cards for each enabled calculator
        for (const calc of enabledCalcs) {
            const container = categories[calc.category];
            if (!container) {
                console.warn(`No container found for category: ${calc.category}`);
                continue;
            }

            const cardHtml = this.createCardHTML(calc);
            container.insertAdjacentHTML('beforeend', cardHtml);
        }

        console.log(`Generated ${enabledCalcs.length} calculator cards`);

        // Hide empty sections
        this.hideEmptySections();
    },

    /**
     * Create HTML for calculator card
     */
    createCardHTML(calc) {
        const t = window.WineCalcI18n?.t || ((key) => key);

        return `
            <div class="col-md-6 mb-4 calculator-card"
                 data-name="${calc.id}"
                 data-category="${calc.category}">
                <div class="card h-100 hover-lift">
                    <div class="card-body">
                        <div class="d-flex align-items-start mb-3">
                            <div class="icon-circle bg-wine-light me-3">
                                <i class="bi ${calc.icon} fs-3 text-wine"></i>
                            </div>
                            <div>
                                <h5 class="card-title" data-i18n="calculators.${calc.id}.title">
                                    ${t(`calculators.${calc.id}.title`)}
                                </h5>
                                <p class="card-text text-muted" data-i18n="calculators.${calc.id}.description">
                                    ${t(`calculators.${calc.id}.description`)}
                                </p>
                            </div>
                        </div>
                        <a href="#" class="btn btn-outline-wine btn-sm calculator-link w-100"
                           data-calculator="${calc.id}"
                           data-js-file="${calc.jsFile}">
                            <i class="bi bi-calculator me-2"></i>
                            <span data-i18n="common.calculate">${t('common.calculate')}</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Hide sections with no enabled calculators
     */
    hideEmptySections() {
        const sections = ['chemical', 'specialized', 'reference', 'sensory', 'additional'];

        sections.forEach(sectionId => {
            const section = document.getElementById(`${sectionId}-calculators`);
            if (!section) return;

            const cards = section.querySelectorAll('.calculator-card');
            if (cards.length === 0) {
                section.style.display = 'none';
            } else {
                section.style.display = '';
            }
        });
    },

    /**
     * Lazy load calculator module (only when needed)
     */
    async loadCalculatorModule(calculatorId) {
        // Check if already loaded
        if (this.loadedModules.has(calculatorId)) {
            console.log(`Calculator ${calculatorId} already loaded`);
            return true;
        }

        // Find calculator config
        const calcConfig = this.config.calculators.find(c => c.id === calculatorId);
        if (!calcConfig) {
            console.error(`No config found for calculator: ${calculatorId}`);
            return false;
        }

        if (!calcConfig.jsFile) {
            console.warn(`No JS file specified for calculator: ${calculatorId}`);
            return false;
        }

        try {
            console.log(`Loading calculator module: ${calculatorId} from ${calcConfig.jsFile}`);

            // Dynamically load script
            await this.loadScript(calcConfig.jsFile);

            // Mark as loaded
            this.loadedModules.add(calculatorId);

            console.log(`✓ Calculator ${calculatorId} loaded successfully`);
            return true;

        } catch (error) {
            console.error(`Error loading calculator ${calculatorId}:`, error);
            return false;
        }
    },

    /**
     * Dynamically load a script file
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            // Check if script already exists
            const existing = document.querySelector(`script[src="${src}"]`);
            if (existing) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.body.appendChild(script);
        });
    },

    /**
     * Check if calculator module is loaded
     */
    isCalculatorLoaded(calculatorId) {
        return this.loadedModules.has(calculatorId);
    },

    /**
     * Get list of enabled calculators
     */
    getEnabledCalculators() {
        if (!this.config) return [];
        return this.config.calculators.filter(c => c.enabled);
    },

    /**
     * Get calculator config by ID
     */
    getCalculatorConfig(calculatorId) {
        if (!this.config) return null;
        return this.config.calculators.find(c => c.id === calculatorId);
    },

    /**
     * Enable/disable calculator (runtime)
     */
    setCalculatorEnabled(calculatorId, enabled) {
        if (!this.config) return;

        const calc = this.config.calculators.find(c => c.id === calculatorId);
        if (calc) {
            calc.enabled = enabled;
            console.log(`Calculator ${calculatorId} ${enabled ? 'enabled' : 'disabled'}`);
        }
    }
};
