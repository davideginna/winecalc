/* WineCalc - Carbon Addition Calculator */

/**
 * Calculate carbon (activated charcoal) addition for wine/juice treatment
 *
 * Carbon is used to remove color, off-odors, and certain compounds from wine or juice.
 * This calculator determines the amount of carbon needed based on desired dosage.
 *
 * @param {Object} data - Input data
 * @param {number} data.carbonAmount - Desired carbon amount in mg/L
 * @param {number} data.volume - Volume of wine/juice in liters
 * @returns {Object} Calculation results
 */
function calculateCarbon(data) {
    const { carbonAmount, volume } = data;

    // Validation
    if (!carbonAmount || isNaN(carbonAmount) || carbonAmount <= 0) {
        throw new Error(WineCalcI18n.t('errors.positiveValue'));
    }

    if (!volume || isNaN(volume) || volume <= 0) {
        throw new Error(WineCalcI18n.t('errors.volumeRequired'));
    }

    // Formula: Amount (g) = (Carbon mg/L × Volume L) / 1000
    const amountG = (carbonAmount * volume) / 1000;

    return {
        amountG: Math.round(amountG * 10) / 10  // Amount in g (1 decimal)
    };
}

// Export function
window.calculateCarbon = calculateCarbon;
