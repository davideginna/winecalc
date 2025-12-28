/**
 * Diammonium Phosphate (Pre-Fermentation) Addition Calculator
 *
 * Calculates the amount of DAP needed to increase YAN to a required level
 * before fermentation starts.
 *
 * Formula:
 * YAN difference (mg/L) = Required YAN - Initial YAN
 * DAP amount (g) = (YAN difference × Volume) / (4.7 × 1000)
 *
 * Where 4.7 mg/L DAP ≈ 1 mg/L YAN
 */

function calculateDapPreFermentation(data) {
    const { initialYan, requiredYan, volume } = data;

    // Validation
    if (initialYan === undefined || initialYan === null || isNaN(initialYan) || initialYan < 0) {
        throw new Error(window.WineCalcI18n.t('errors.invalidInput'));
    }
    if (requiredYan === undefined || requiredYan === null || isNaN(requiredYan) || requiredYan < 0) {
        throw new Error(window.WineCalcI18n.t('errors.invalidInput'));
    }
    if (!volume || isNaN(volume) || volume <= 0) {
        throw new Error(window.WineCalcI18n.t('errors.invalidVolume'));
    }

    // Calculate YAN difference
    const yanDifference = requiredYan - initialYan;

    // If initial YAN is already higher than required, no DAP needed
    if (yanDifference <= 0) {
        return {
            dapAmount: 0
        };
    }

    // Calculate DAP amount in grams
    // Formula: (YAN difference mg/L × Volume L × 4.7) / 1000
    // Where 1 mg/L YAN = 4.7 mg/L DAP
    const YAN_TO_DAP_RATIO = 4.7;
    const dapAmount = (yanDifference * volume * YAN_TO_DAP_RATIO) / 1000;

    return {
        dapAmount: Math.round(dapAmount * 100) / 100  // 2 decimals
    };
}

// Export function
window.calculateDapPreFermentation = calculateDapPreFermentation;
