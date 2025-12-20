/* WineCalc - Utility Functions */

// Format number with specified decimal places
function formatNumber(value, decimals = 2) {
    if (value === null || value === undefined || isNaN(value)) {
        return '-';
    }
    return Number(value).toFixed(decimals);
}

// Validate positive number
function isPositiveNumber(value) {
    const num = Number(value);
    return !isNaN(num) && num > 0;
}

// Validate number in range
function isInRange(value, min, max) {
    const num = Number(value);
    return !isNaN(num) && num >= min && num <= max;
}

// Get form data as object
function getFormData(formElement) {
    const formData = new FormData(formElement);
    const data = {};

    for (let [key, value] of formData.entries()) {
        // Convert numeric values
        if (value && !isNaN(value)) {
            data[key] = Number(value);
        } else {
            data[key] = value;
        }
    }

    return data;
}

// Show error message
function showError(message, containerId = 'errorContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>${WineCalcI18n.t('common.error')}:</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

// Show success message
function showSuccess(message, containerId = 'successContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i>
            <strong>${WineCalcI18n.t('common.success')}:</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

// Clear messages
function clearMessages(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '';
    }
}

// Validate form inputs
function validateForm(formElement, rules) {
    const data = getFormData(formElement);
    const errors = [];

    for (let field in rules) {
        const rule = rules[field];
        const value = data[field];

        // Required field
        if (rule.required && (!value || value === '')) {
            errors.push({
                field: field,
                message: rule.message || WineCalcI18n.t('common.required')
            });
            continue;
        }

        // Skip other validations if field is empty and not required
        if (!value) continue;

        // Positive number
        if (rule.positive && !isPositiveNumber(value)) {
            errors.push({
                field: field,
                message: rule.message || WineCalcI18n.t('errors.positiveValue')
            });
        }

        // Range validation
        if (rule.min !== undefined || rule.max !== undefined) {
            const min = rule.min ?? -Infinity;
            const max = rule.max ?? Infinity;
            if (!isInRange(value, min, max)) {
                errors.push({
                    field: field,
                    message: rule.message || WineCalcI18n.t('errors.invalidRange')
                });
            }
        }

        // Custom validation
        if (rule.custom && typeof rule.custom === 'function') {
            const customError = rule.custom(value, data);
            if (customError) {
                errors.push({
                    field: field,
                    message: customError
                });
            }
        }
    }

    // Highlight error fields
    formElement.querySelectorAll('.is-invalid').forEach(el => {
        el.classList.remove('is-invalid');
    });

    errors.forEach(error => {
        const field = formElement.querySelector(`[name="${error.field}"]`);
        if (field) {
            field.classList.add('is-invalid');
        }
    });

    return {
        valid: errors.length === 0,
        errors: errors
    };
}

// Save result to localStorage
function saveResult(calculatorId, result) {
    try {
        const key = `wineCalc_${calculatorId}_history`;
        let history = JSON.parse(localStorage.getItem(key) || '[]');

        history.unshift({
            timestamp: new Date().toISOString(),
            result: result
        });

        // Keep only last 10 results
        history = history.slice(0, 10);

        localStorage.setItem(key, JSON.stringify(history));
        return true;
    } catch (error) {
        console.error('Error saving result:', error);
        return false;
    }
}

// Get result history
function getResultHistory(calculatorId) {
    try {
        const key = `wineCalc_${calculatorId}_history`;
        return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (error) {
        console.error('Error getting history:', error);
        return [];
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const lang = WineCalcI18n.getCurrentLanguage();

    return new Intl.DateTimeFormat(lang, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Print results
function printResults() {
    window.print();
}

// Export results as JSON
function exportResultsAsJSON(calculatorId, result) {
    const data = {
        calculator: calculatorId,
        timestamp: new Date().toISOString(),
        result: result
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `winecalc_${calculatorId}_${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
}

// Copy to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showSuccess(WineCalcI18n.t('common.copied') || 'Copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

// Smooth scroll to element
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Export utility functions
window.WineCalcUtils = {
    formatNumber,
    isPositiveNumber,
    isInRange,
    getFormData,
    showError,
    showSuccess,
    clearMessages,
    validateForm,
    saveResult,
    getResultHistory,
    formatDate,
    debounce,
    printResults,
    exportResultsAsJSON,
    copyToClipboard,
    scrollToElement
};
