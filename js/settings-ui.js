/* WineCalc - Settings UI Manager */

// Initialize settings UI
function initSettingsUI() {
    console.log('Initializing Settings UI...');

    // Setup dark mode toggle in navbar
    setupDarkModeToggle();

    // Setup theme mode buttons
    setupThemeModeButtons();

    // Setup color theme buttons
    setupColorThemeButtons();

    // Setup accessibility switches
    setupAccessibilitySwitches();

    // Setup reset button
    setupResetButton();

    // Update UI to reflect current settings
    updateSettingsUI();

    // Listen for theme changes
    window.addEventListener('themeChanged', updateSettingsUI);
    window.addEventListener('colorThemeChanged', updateSettingsUI);
    window.addEventListener('accessibilityChanged', updateSettingsUI);

    console.log('Settings UI initialized');
}

// Setup dark mode toggle button in navbar
function setupDarkModeToggle() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) return;

    darkModeToggle.addEventListener('click', () => {
        const newTheme = WineCalcTheme.toggleTheme();
        updateDarkModeIcon(newTheme);
    });

    // Initialize icon
    const currentTheme = WineCalcTheme.getCurrentTheme().theme;
    updateDarkModeIcon(currentTheme);
}

// Update dark mode icon
function updateDarkModeIcon(theme) {
    const icon = document.getElementById('darkModeIcon');
    if (!icon) return;

    if (theme === 'dark') {
        icon.className = 'bi bi-sun';
    } else {
        icon.className = 'bi bi-moon-stars';
    }
}

// Setup theme mode buttons (Light/Dark)
function setupThemeModeButtons() {
    const buttons = document.querySelectorAll('.theme-mode-btn');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-theme');
            WineCalcTheme.setTheme(theme);
            updateThemeModeButtons();
        });
    });
}

// Update theme mode buttons active state
function updateThemeModeButtons() {
    const currentTheme = WineCalcTheme.getCurrentTheme().theme;
    const buttons = document.querySelectorAll('.theme-mode-btn');

    buttons.forEach(button => {
        const theme = button.getAttribute('data-theme');
        if (theme === currentTheme) {
            button.classList.remove('btn-outline-primary-theme');
            button.classList.add('btn-primary-theme');
        } else {
            button.classList.remove('btn-primary-theme');
            button.classList.add('btn-outline-primary-theme');
        }
    });
}

// Setup color theme buttons
function setupColorThemeButtons() {
    const buttons = document.querySelectorAll('.color-theme-btn');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const colorTheme = button.getAttribute('data-color-theme');
            WineCalcTheme.setColorTheme(colorTheme);
            updateColorThemeButtons();
        });
    });
}

// Update color theme buttons active state
function updateColorThemeButtons() {
    const currentColorTheme = WineCalcTheme.getCurrentTheme().colorTheme;
    const buttons = document.querySelectorAll('.color-theme-btn');

    buttons.forEach(button => {
        const colorTheme = button.getAttribute('data-color-theme');
        if (colorTheme === currentColorTheme) {
            button.classList.remove('btn-outline-primary-theme');
            button.classList.add('btn-primary-theme');
        } else {
            button.classList.remove('btn-primary-theme');
            button.classList.add('btn-outline-primary-theme');
        }
    });
}

// Setup accessibility switches
function setupAccessibilitySwitches() {
    const highContrastSwitch = document.getElementById('highContrastSwitch');
    const reducedMotionSwitch = document.getElementById('reducedMotionSwitch');
    const largeTextSwitch = document.getElementById('largeTextSwitch');

    if (highContrastSwitch) {
        highContrastSwitch.addEventListener('change', (e) => {
            WineCalcTheme.toggleAccessibility('highContrast');
        });
    }

    if (reducedMotionSwitch) {
        reducedMotionSwitch.addEventListener('change', (e) => {
            WineCalcTheme.toggleAccessibility('reducedMotion');
        });
    }

    if (largeTextSwitch) {
        largeTextSwitch.addEventListener('change', (e) => {
            WineCalcTheme.toggleAccessibility('largeText');
        });
    }
}

// Update accessibility switches state
function updateAccessibilitySwitches() {
    const settings = WineCalcTheme.getCurrentTheme().accessibility;

    const highContrastSwitch = document.getElementById('highContrastSwitch');
    const reducedMotionSwitch = document.getElementById('reducedMotionSwitch');
    const largeTextSwitch = document.getElementById('largeTextSwitch');

    if (highContrastSwitch) {
        highContrastSwitch.checked = settings.highContrast;
    }

    if (reducedMotionSwitch) {
        reducedMotionSwitch.checked = settings.reducedMotion;
    }

    if (largeTextSwitch) {
        largeTextSwitch.checked = settings.largeText;
    }
}

// Setup reset button
function setupResetButton() {
    const resetBtn = document.getElementById('resetSettingsBtn');
    if (!resetBtn) return;

    resetBtn.addEventListener('click', () => {
        if (confirm(WineCalcI18n.t('settings.resetConfirm') || 'Reset all settings to defaults?')) {
            WineCalcTheme.reset();
            updateSettingsUI();

            // Show success message
            WineCalcUtils.showSuccess(
                WineCalcI18n.t('settings.resetSuccess') || 'Settings reset successfully'
            );
        }
    });
}

// Update entire settings UI
function updateSettingsUI() {
    updateDarkModeIcon(WineCalcTheme.getCurrentTheme().theme);
    updateThemeModeButtons();
    updateColorThemeButtons();
    updateAccessibilitySwitches();
}

// Export for global access
window.WineCalcSettingsUI = {
    init: initSettingsUI,
    update: updateSettingsUI
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSettingsUI);
} else {
    initSettingsUI();
}
