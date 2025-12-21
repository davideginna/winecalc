/* WineCalc - Theme & Accessibility Manager */

// Theme configuration
const THEMES = {
    light: 'light',
    dark: 'dark'
};

const COLOR_THEMES = {
    wine: { name: 'Wine', icon: '🍷', description: 'Classic bordeaux and gold' },
    ocean: { name: 'Ocean', icon: '🌊', description: 'Blue and aqua tones' },
    forest: { name: 'Forest', icon: '🌲', description: 'Green and earth tones' },
    lavender: { name: 'Lavender', icon: '💜', description: 'Purple and violet tones' },
    sunset: { name: 'Sunset', icon: '🌅', description: 'Orange and warm tones' }
};

// Accessibility features
const ACCESSIBILITY_FEATURES = {
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    keyboardNav: false
};

class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme();
        this.currentColorTheme = this.getStoredColorTheme();
        this.accessibilitySettings = this.getStoredAccessibility();

        this.init();
    }

    init() {
        // Apply theme on load
        this.applyTheme(this.currentTheme);
        this.applyColorTheme(this.currentColorTheme);
        this.applyAccessibilitySettings();

        // Detect system preference changes
        this.watchSystemPreferences();

        // Detect keyboard navigation
        this.detectKeyboardNavigation();

        console.log('ThemeManager initialized', {
            theme: this.currentTheme,
            colorTheme: this.currentColorTheme,
            accessibility: this.accessibilitySettings
        });
    }

    // Get stored theme (light/dark)
    getStoredTheme() {
        const stored = localStorage.getItem('wineCalcTheme');
        if (stored && Object.values(THEMES).includes(stored)) {
            return stored;
        }

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return THEMES.dark;
        }

        return THEMES.light;
    }

    // Get stored color theme
    getStoredColorTheme() {
        const stored = localStorage.getItem('wineCalcColorTheme');
        if (stored && COLOR_THEMES[stored]) {
            return stored;
        }
        return 'wine'; // Default
    }

    // Get stored accessibility settings
    getStoredAccessibility() {
        const stored = localStorage.getItem('wineCalcAccessibility');
        if (stored) {
            try {
                return { ...ACCESSIBILITY_FEATURES, ...JSON.parse(stored) };
            } catch (e) {
                console.error('Error parsing accessibility settings:', e);
            }
        }

        // Check system preferences
        return {
            highContrast: window.matchMedia('(prefers-contrast: high)').matches,
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            largeText: false,
            keyboardNav: false
        };
    }

    // Apply theme (light/dark)
    applyTheme(theme) {
        this.currentTheme = theme;

        if (theme === THEMES.dark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        localStorage.setItem('wineCalcTheme', theme);

        // Dispatch event
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme, colorTheme: this.currentColorTheme }
        }));
    }

    // Apply color theme
    applyColorTheme(colorTheme) {
        this.currentColorTheme = colorTheme;

        // Remove all color theme attributes
        Object.keys(COLOR_THEMES).forEach(theme => {
            if (theme !== colorTheme) {
                document.documentElement.removeAttribute(`data-color-theme-${theme}`);
            }
        });

        // Apply selected color theme
        if (colorTheme !== 'wine') {
            document.documentElement.setAttribute('data-color-theme', colorTheme);
        } else {
            document.documentElement.removeAttribute('data-color-theme');
        }

        localStorage.setItem('wineCalcColorTheme', colorTheme);

        // Dispatch event
        window.dispatchEvent(new CustomEvent('colorThemeChanged', {
            detail: { theme: this.currentTheme, colorTheme }
        }));
    }

    // Toggle theme (light ↔ dark)
    toggleTheme() {
        const newTheme = this.currentTheme === THEMES.light ? THEMES.dark : THEMES.light;
        this.applyTheme(newTheme);
        return newTheme;
    }

    // Set specific theme
    setTheme(theme) {
        if (Object.values(THEMES).includes(theme)) {
            this.applyTheme(theme);
        }
    }

    // Set color theme
    setColorTheme(colorTheme) {
        if (COLOR_THEMES[colorTheme]) {
            this.applyColorTheme(colorTheme);
        }
    }

    // Apply accessibility settings
    applyAccessibilitySettings() {
        const settings = this.accessibilitySettings;

        // High Contrast
        if (settings.highContrast) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }

        // Reduced Motion
        if (settings.reducedMotion) {
            document.documentElement.classList.add('reduced-motion');
        } else {
            document.documentElement.classList.remove('reduced-motion');
        }

        // Large Text
        if (settings.largeText) {
            document.documentElement.classList.add('large-text');
            document.documentElement.style.fontSize = '18px';
        } else {
            document.documentElement.classList.remove('large-text');
            document.documentElement.style.fontSize = '';
        }

        // Keyboard Navigation
        if (settings.keyboardNav) {
            document.body.classList.add('keyboard-nav');
        } else {
            document.body.classList.remove('keyboard-nav');
        }

        localStorage.setItem('wineCalcAccessibility', JSON.stringify(settings));
    }

    // Toggle accessibility feature
    toggleAccessibility(feature) {
        if (feature in this.accessibilitySettings) {
            this.accessibilitySettings[feature] = !this.accessibilitySettings[feature];
            this.applyAccessibilitySettings();

            window.dispatchEvent(new CustomEvent('accessibilityChanged', {
                detail: { feature, enabled: this.accessibilitySettings[feature] }
            }));
        }
    }

    // Watch system preferences
    watchSystemPreferences() {
        // Watch for dark mode changes
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            darkModeQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem('wineCalcTheme')) {
                    // Only auto-switch if user hasn't manually set a preference
                    this.applyTheme(e.matches ? THEMES.dark : THEMES.light);
                }
            });

            // Watch for reduced motion preference
            const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            motionQuery.addEventListener('change', (e) => {
                this.accessibilitySettings.reducedMotion = e.matches;
                this.applyAccessibilitySettings();
            });

            // Watch for high contrast preference
            const contrastQuery = window.matchMedia('(prefers-contrast: high)');
            contrastQuery.addEventListener('change', (e) => {
                this.accessibilitySettings.highContrast = e.matches;
                this.applyAccessibilitySettings();
            });
        }
    }

    // Detect keyboard navigation
    detectKeyboardNavigation() {
        let isUsingMouse = false;

        // Mouse usage detected
        document.addEventListener('mousedown', () => {
            isUsingMouse = true;
            this.accessibilitySettings.keyboardNav = false;
            this.applyAccessibilitySettings();
        });

        // Keyboard usage detected (Tab key)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && !isUsingMouse) {
                this.accessibilitySettings.keyboardNav = true;
                this.applyAccessibilitySettings();
            }
        });
    }

    // Get current theme info
    getCurrentTheme() {
        return {
            theme: this.currentTheme,
            colorTheme: this.currentColorTheme,
            colorThemeInfo: COLOR_THEMES[this.currentColorTheme],
            accessibility: this.accessibilitySettings
        };
    }

    // Get all available themes
    getAvailableThemes() {
        return {
            themes: THEMES,
            colorThemes: COLOR_THEMES
        };
    }

    // Export settings
    exportSettings() {
        return {
            theme: this.currentTheme,
            colorTheme: this.currentColorTheme,
            accessibility: this.accessibilitySettings,
            version: '1.0'
        };
    }

    // Import settings
    importSettings(settings) {
        if (settings.theme) {
            this.applyTheme(settings.theme);
        }
        if (settings.colorTheme) {
            this.applyColorTheme(settings.colorTheme);
        }
        if (settings.accessibility) {
            this.accessibilitySettings = { ...this.accessibilitySettings, ...settings.accessibility };
            this.applyAccessibilitySettings();
        }
    }

    // Reset to defaults
    resetToDefaults() {
        localStorage.removeItem('wineCalcTheme');
        localStorage.removeItem('wineCalcColorTheme');
        localStorage.removeItem('wineCalcAccessibility');

        this.currentTheme = THEMES.light;
        this.currentColorTheme = 'wine';
        this.accessibilitySettings = { ...ACCESSIBILITY_FEATURES };

        this.applyTheme(this.currentTheme);
        this.applyColorTheme(this.currentColorTheme);
        this.applyAccessibilitySettings();
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Export for global access
window.WineCalcTheme = {
    manager: themeManager,
    toggleTheme: () => themeManager.toggleTheme(),
    setTheme: (theme) => themeManager.setTheme(theme),
    setColorTheme: (colorTheme) => themeManager.setColorTheme(colorTheme),
    toggleAccessibility: (feature) => themeManager.toggleAccessibility(feature),
    getCurrentTheme: () => themeManager.getCurrentTheme(),
    getAvailableThemes: () => themeManager.getAvailableThemes(),
    exportSettings: () => themeManager.exportSettings(),
    importSettings: (settings) => themeManager.importSettings(settings),
    reset: () => themeManager.resetToDefaults(),
    THEMES,
    COLOR_THEMES
};

// Auto-initialize
console.log('WineCalc Theme System loaded', themeManager.getCurrentTheme());
