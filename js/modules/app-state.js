/* WineCalc - Application State Management */

/**
 * Centralized application state
 */
export const AppState = {
    // Current calculator being displayed
    currentCalculator: null,

    // Current search query
    searchQuery: '',

    // Bootstrap modal instance
    modal: null,

    // Calculation history
    history: [],

    // User preferences (synced with localStorage via ThemeManager)
    preferences: {
        language: 'it',
        theme: 'light',
        colorTheme: 'wine'
    },

    // Calculator function cache (performance optimization)
    // Maps calculator ID to function reference
    calculatorFunctions: new Map()
};

/**
 * State management utility
 */
export const StateManager = {
    /**
     * Get current state
     */
    getState() {
        return AppState;
    },

    /**
     * Update state
     */
    setState(updates) {
        Object.assign(AppState, updates);
        this.notifyListeners(updates);
    },

    /**
     * Update specific state property
     */
    updateState(key, value) {
        AppState[key] = value;
        this.notifyListeners({ [key]: value });
    },

    /**
     * State change listeners
     */
    _listeners: [],

    /**
     * Subscribe to state changes
     */
    subscribe(callback) {
        this._listeners.push(callback);
        return () => {
            this._listeners = this._listeners.filter(cb => cb !== callback);
        };
    },

    /**
     * Notify all listeners of state change
     */
    notifyListeners(changes) {
        this._listeners.forEach(callback => {
            try {
                callback(changes, AppState);
            } catch (error) {
                console.error('Error in state listener:', error);
            }
        });
    },

    /**
     * Add calculation to history
     */
    addToHistory(calculatorId, inputs, results) {
        const entry = {
            id: Date.now(),
            calculator: calculatorId,
            timestamp: new Date().toISOString(),
            inputs: inputs,
            results: results
        };

        AppState.history.unshift(entry);

        // Keep only last 50 calculations
        if (AppState.history.length > 50) {
            AppState.history = AppState.history.slice(0, 50);
        }

        this.saveHistory();
        this.notifyListeners({ history: AppState.history });
    },

    /**
     * Get calculation history
     */
    getHistory(calculatorId = null) {
        if (calculatorId) {
            return AppState.history.filter(entry => entry.calculator === calculatorId);
        }
        return AppState.history;
    },

    /**
     * Clear history
     */
    clearHistory() {
        AppState.history = [];
        localStorage.removeItem('wineCalcHistory');
        this.notifyListeners({ history: [] });
    },

    /**
     * Save history to localStorage
     */
    saveHistory() {
        try {
            localStorage.setItem('wineCalcHistory', JSON.stringify(AppState.history));
        } catch (error) {
            console.error('Error saving history:', error);
        }
    },

    /**
     * Load history from localStorage
     */
    loadHistory() {
        try {
            const saved = localStorage.getItem('wineCalcHistory');
            if (saved) {
                AppState.history = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading history:', error);
            AppState.history = [];
        }
    },

    /**
     * Initialize state from localStorage
     */
    initialize() {
        this.loadHistory();
        console.log('State manager initialized');
    },

    /**
     * Register calculator function (performance optimization)
     * Caches the function reference to avoid repeated string conversions
     */
    registerCalculatorFunction(calculatorId, functionRef) {
        AppState.calculatorFunctions.set(calculatorId, functionRef);
    },

    /**
     * Get calculator function from cache
     * Returns the cached function reference or null
     */
    getCalculatorFunction(calculatorId) {
        return AppState.calculatorFunctions.get(calculatorId) || null;
    },

    /**
     * Check if calculator function is registered
     */
    hasCalculatorFunction(calculatorId) {
        return AppState.calculatorFunctions.has(calculatorId);
    }
};
