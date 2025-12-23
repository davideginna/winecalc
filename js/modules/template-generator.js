/* WineCalc - Template Generator */

/**
 * Generates HTML templates for calculator forms dynamically from configuration
 */
export const TemplateGenerator = {
    fieldsConfigCache: {},

    /**
     * Load fields configuration for a specific calculator
     */
    async loadFieldsConfig(calculatorId) {
        // Check cache
        if (this.fieldsConfigCache[calculatorId]) {
            return this.fieldsConfigCache[calculatorId];
        }

        try {
            const response = await fetch(`js/calculators-fields/${calculatorId}.json`);
            if (!response.ok) {
                throw new Error(`Config not found for ${calculatorId}`);
            }
            const config = await response.json();
            this.fieldsConfigCache[calculatorId] = config;
            return config;
        } catch (error) {
            console.error(`Failed to load fields config for ${calculatorId}:`, error);
            return null;
        }
    },

    /**
     * Generate template for calculator
     */
    async generate(calculatorId) {
        // Load config for this specific calculator
        const config = await this.loadFieldsConfig(calculatorId);

        // Check if calculator has field configuration
        if (config) {
            return this.generateDynamicTemplate(calculatorId, config);
        }

        // Fallback to coming soon template
        return this.getComingSoonTemplate(calculatorId);
    },

    /**
     * Generate dynamic template from configuration
     */
    generateDynamicTemplate(calculatorId, config) {
        const t = WineCalcI18n.t;

        let html = '';

        // Add info alert if configured
        if (config.info) {
            const alertType = config.alertType || 'info';
            html += `
                <div class="alert alert-${alertType} mb-4">
                    <i class="bi bi-info-circle me-2"></i>
                    ${t(`calculators.${calculatorId}.info`)}
                </div>
            `;
        }

        // Generate form
        html += '<form id="calculatorForm" class="calculator-form">';

        // Generate fields
        config.fields.forEach(field => {
            html += this.generateField(field);
        });

        // Add error container
        html += '<div id="errorContainer"></div>';

        // Add form buttons
        html += this.getFormButtons();

        html += '</form>';

        // Add results container
        html += '<div id="resultsContainer"></div>';

        return html;
    },

    /**
     * Generate a single form field
     */
    generateField(field) {
        switch (field.type) {
            case 'number':
                return this.generateNumberField(field);
            case 'select':
                return this.generateSelectField(field);
            case 'text':
                return this.generateTextField(field);
            default:
                console.warn(`Unknown field type: ${field.type}`);
                return '';
        }
    },

    /**
     * Generate number input field
     */
    generateNumberField(field) {
        const t = WineCalcI18n.t;
        const label = t(field.label);

        const attributes = [
            `type="number"`,
            `class="form-control"`,
            `id="${field.id}"`,
            `name="${field.id}"`,
            field.min !== undefined ? `min="${field.min}"` : '',
            field.max !== undefined ? `max="${field.max}"` : '',
            field.step !== undefined ? `step="${field.step}"` : '',
            field.placeholder ? `placeholder="${field.placeholder}"` : '',
            field.value ? `value="${field.value}"` : '',
            field.required ? 'required' : ''
        ].filter(Boolean).join(' ');

        let html = `
            <div class="mb-3">
                <label for="${field.id}" class="form-label">${label}</label>
                <input ${attributes}>
        `;

        if (field.helpText) {
            html += `<div class="form-text">${field.helpText}</div>`;
        }

        html += '</div>';

        return html;
    },

    /**
     * Generate select dropdown field
     */
    generateSelectField(field) {
        const t = WineCalcI18n.t;
        const label = t(field.label);

        let html = `
            <div class="mb-3">
                <label for="${field.id}" class="form-label">${label}</label>
                <select class="form-select" id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''}>
        `;

        field.options.forEach(option => {
            const optionLabel = t(option.label);
            const selected = option.selected ? 'selected' : '';
            html += `<option value="${option.value}" ${selected}>${optionLabel}</option>`;
        });

        html += '</select>';

        if (field.helpText) {
            html += `<div class="form-text">${field.helpText}</div>`;
        }

        html += '</div>';

        return html;
    },

    /**
     * Generate text input field
     */
    generateTextField(field) {
        const t = WineCalcI18n.t;
        const label = t(field.label);

        const attributes = [
            `type="text"`,
            `class="form-control"`,
            `id="${field.id}"`,
            `name="${field.id}"`,
            field.placeholder ? `placeholder="${field.placeholder}"` : '',
            field.value ? `value="${field.value}"` : '',
            field.required ? 'required' : ''
        ].filter(Boolean).join(' ');

        let html = `
            <div class="mb-3">
                <label for="${field.id}" class="form-label">${label}</label>
                <input ${attributes}>
        `;

        if (field.helpText) {
            html += `<div class="form-text">${field.helpText}</div>`;
        }

        html += '</div>';

        return html;
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
