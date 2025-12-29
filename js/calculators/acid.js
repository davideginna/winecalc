/* WineCalc - Tartaric Acid Addition Calculator */

/**
 * Calculate tartaric acid addition for wine
 *
 * Tartaric acid (L(+)-tartaric acid, C4H6O6) is the primary acid used
 * in European winemaking for acidity correction.
 * Standard addition: 1 g/L increases total acidity by approximately 1 g/L
 *
 * @param {Object} data - Input data
 * @param {number} data.additionRate - Desired addition rate of tartaric acid in g/L
 * @param {number} data.volume - Volume of wine/ferment/juice in liters
 * @returns {Object} Calculation results
 */
function calculateAcid(data) {
    const { additionRate, volume } = data;

    // Validation
    if (!volume || isNaN(volume) || volume <= 0) {
        throw new Error(WineCalcI18n.t('errors.volumeRequired'));
    }

    if (!additionRate || isNaN(additionRate) || additionRate <= 0) {
        throw new Error(WineCalcI18n.t('errors.positiveValue'));
    }

    // Formula: Amount (kg) = (Addition Rate g/L × Volume L) / 1000
    // This converts from g/L to kg total
    const amountKg = (additionRate * volume) / 1000;
    const amountG = additionRate * volume;

    return {
        amountKg: Math.round(amountKg * 1000) / 1000,     // Amount in kg (3 decimals)
        amountG: Math.round(amountG * 10) / 10,           // Amount in g (1 decimal)
        additionRate: additionRate,                        // Echo back the rate
        volume: volume                                     // Echo back the volume
    };
}

// Export function
window.calculateAcid = calculateAcid;
