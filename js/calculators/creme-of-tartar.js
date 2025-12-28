/* WineCalc - Crème of Tartar Addition Calculator */

/**
 * Calculate crème of tartar (potassium bitartrate) addition for cold stabilization
 *
 * Crème of tartar is used for cold stabilization of wine to prevent tartrate crystal
 * formation in the bottle. It should only be added when wine temperature is below 0°C.
 *
 * @param {Object} data - Input data
 * @param {number} data.additionRate - Desired addition rate of crème of tartar in mg/L
 * @param {number} data.volume - Volume of wine in liters
 * @returns {Object} Calculation results
 */
function calculate_creme_of_tartar(data) {
    const { additionRate, volume } = data;

    // Validation
    if (!additionRate || additionRate <= 0) {
        throw new Error(WineCalcI18n.t('errors.positiveValue'));
    }

    if (!volume || volume <= 0) {
        throw new Error(WineCalcI18n.t('errors.volumeRequired'));
    }

    // Formula: Amount (kg) = (Addition rate mg/L × Volume L) / 1,000,000
    const amountKg = (additionRate * volume) / 1000000;

    return {
        amountKg: Math.round(amountKg * 1000) / 1000  // Amount in kg (3 decimals)
    };
}

// Export function
window.calculate_creme_of_tartar = calculate_creme_of_tartar;
