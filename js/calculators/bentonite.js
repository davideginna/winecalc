/* WineCalc - Bentonite Addition Calculator */

/**
 * Calculate volume of bentonite solution needed for wine fining
 *
 * Bentonite is a clay fining agent used to remove unstable proteins from wine.
 * This calculator determines the volume of bentonite solution to add based on:
 * - Desired addition rate (g/L)
 * - Volume of wine/ferment/juice (L)
 * - Concentration of prepared bentonite solution (w/v %)
 *
 * @param {Object} data - Input data
 * @param {number} data.additionRate - Desired addition rate in g/L
 * @param {number} data.volume - Volume of wine/ferment/juice in liters
 * @param {number} data.concentration - Concentration of bentonite solution (w/v %)
 * @returns {Object} Calculation results
 */
function calculateBentonite(data) {
    const { additionRate, volume, concentration } = data;

    // Validation
    if (!additionRate || isNaN(additionRate) || additionRate <= 0) {
        throw new Error(WineCalcI18n.t('errors.positiveValue'));
    }

    if (!volume || isNaN(volume) || volume <= 0) {
        throw new Error(WineCalcI18n.t('errors.volumeRequired'));
    }

    if (!concentration || isNaN(concentration) || concentration <= 0) {
        throw new Error(WineCalcI18n.t('errors.positiveValue'));
    }

    // Formula:
    // 1. Total bentonite needed (g) = Addition Rate (g/L) × Volume (L)
    // 2. Volume of solution (L) = Total bentonite (g) / (Concentration % × 10)
    //    Note: w/v % means g per 100mL, so 10% = 100 g/L

    const totalBentonite = additionRate * volume;
    const solutionVolume = totalBentonite / (concentration * 10);

    return {
        solutionVolume: Math.round(solutionVolume * 1000) / 1000  // Volume in L (3 decimals)
    };
}

// Export function
window.calculateBentonite = calculateBentonite;
