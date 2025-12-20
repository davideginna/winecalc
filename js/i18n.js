/* WineCalc - Internationalization System */

// Language configuration
const SUPPORTED_LANGUAGES = ['it', 'en', 'fr', 'es', 'de'];
const DEFAULT_LANGUAGE = 'it';

// Language names and flags
const LANGUAGE_INFO = {
    it: { name: 'Italiano', flag: '🇮🇹', code: 'IT' },
    en: { name: 'English', flag: '🇬🇧', code: 'EN' },
    fr: { name: 'Français', flag: '🇫🇷', code: 'FR' },
    es: { name: 'Español', flag: '🇪🇸', code: 'ES' },
    de: { name: 'Deutsch', flag: '🇩🇪', code: 'DE' }
};

// Get user's preferred language
function getPreferredLanguage() {
    // Check localStorage
    const saved = localStorage.getItem('wineCalcLanguage');
    if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
        return saved;
    }

    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (SUPPORTED_LANGUAGES.includes(browserLang)) {
        return browserLang;
    }

    return DEFAULT_LANGUAGE;
}

// Initialize i18next
async function initI18n() {
    const currentLang = getPreferredLanguage();

    try {
        await i18next.init({
            lng: currentLang,
            fallbackLng: DEFAULT_LANGUAGE,
            debug: false,
            resources: {}
        });

        // Load translations for current language
        await loadLanguage(currentLang);

        // Update UI
        updatePageLanguage();

        // Setup language switchers
        setupLanguageSwitchers();

        console.log(`WineCalc initialized with language: ${currentLang}`);
    } catch (error) {
        console.error('Error initializing i18n:', error);
    }
}

// Load language resources
async function loadLanguage(lang) {
    try {
        const response = await fetch(`locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load ${lang}.json`);
        }

        const translations = await response.json();

        // Add resources to i18next
        i18next.addResourceBundle(lang, 'translation', translations, true, true);

        return translations;
    } catch (error) {
        console.error(`Error loading language ${lang}:`, error);

        // Fallback to default language if not already trying it
        if (lang !== DEFAULT_LANGUAGE) {
            console.log(`Falling back to ${DEFAULT_LANGUAGE}`);
            return loadLanguage(DEFAULT_LANGUAGE);
        }
    }
}

// Update all translatable elements on the page
function updatePageLanguage() {
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = i18next.t(key);

        if (translation && translation !== key) {
            element.textContent = translation;
        }
    });

    // Update placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = i18next.t(key);

        if (translation && translation !== key) {
            element.placeholder = translation;
        }
    });

    // Update title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        const translation = i18next.t(key);

        if (translation && translation !== key) {
            element.title = translation;
        }
    });

    // Update aria-label attributes
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
        const key = element.getAttribute('data-i18n-aria');
        const translation = i18next.t(key);

        if (translation && translation !== key) {
            element.setAttribute('aria-label', translation);
        }
    });

    // Update current language display
    const currentLangElement = document.getElementById('currentLang');
    if (currentLangElement) {
        const lang = i18next.language;
        currentLangElement.textContent = LANGUAGE_INFO[lang]?.code || lang.toUpperCase();
    }

    // Update HTML lang attribute
    document.documentElement.lang = i18next.language;
}

// Setup language switcher event listeners
function setupLanguageSwitchers() {
    document.querySelectorAll('.lang-switch').forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const lang = e.currentTarget.getAttribute('data-lang');

            if (lang && SUPPORTED_LANGUAGES.includes(lang)) {
                await changeLanguage(lang);
            }
        });
    });
}

// Change language
async function changeLanguage(lang) {
    try {
        // Load language if not already loaded
        if (!i18next.hasResourceBundle(lang, 'translation')) {
            await loadLanguage(lang);
        }

        // Change language
        await i18next.changeLanguage(lang);

        // Save to localStorage
        localStorage.setItem('wineCalcLanguage', lang);

        // Update UI
        updatePageLanguage();

        // Trigger custom event for other components
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));

        console.log(`Language changed to: ${lang}`);
    } catch (error) {
        console.error('Error changing language:', error);
    }
}

// Helper function to translate a key
function t(key, options = {}) {
    return i18next.t(key, options);
}

// Helper function to get current language
function getCurrentLanguage() {
    return i18next.language || DEFAULT_LANGUAGE;
}

// Export functions for use in other scripts
window.WineCalcI18n = {
    init: initI18n,
    t: t,
    changeLanguage: changeLanguage,
    getCurrentLanguage: getCurrentLanguage,
    LANGUAGE_INFO: LANGUAGE_INFO
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
} else {
    initI18n();
}
