/**
 * Diammonium Phosphate Addition Calculator
 *
 * Calculates the amount of DAP to add to a fermenting must based on
 * the desired concentration.
 *
 * Formula:
 * DAP amount (g) = (DAP mg/L × Volume L) / 1000
 */

function calculate_dap_addition(data) {
    const { dapRequired, volume } = data;

    // Validation
    if (!dapRequired || dapRequired < 0) {
        throw new Error(window.WineCalcI18n.t('errors.invalidInput'));
    }
    if (!volume || volume <= 0) {
        throw new Error(window.WineCalcI18n.t('errors.invalidVolume'));
    }

    // Calculate DAP amount in grams
    // Formula: (DAP mg/L × Volume L) / 1000
    const dapAmount = (dapRequired * volume) / 1000;

    return {
        dapAmount: Math.round(dapAmount * 100) / 100  // 2 decimals
    };
}
