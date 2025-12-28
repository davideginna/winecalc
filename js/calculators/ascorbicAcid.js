/* WineCalc - Ascorbic Acid Addition Calculator */

/**
 * Calculate ascorbic acid addition for wine preservation
 *
 * Ascorbic acid (Vitamin C) is used as an antioxidant in winemaking.
 * It should be used in conjunction with SO2 for effective preservation.
 * Typical dosage: 50-100 mg/L
 *
 * @param {Object} data - Input data
 * @param {number} data.volume - Volume of wine in liters
 * @param {number} data.additionRate - Desired addition rate in mg/L
 * @returns {Object} Calculation results
 */
function calculateAscorbicAcid(data) {
    const { additionRate, volume } = data;

    // Validation
    if (!additionRate || additionRate <= 0) {
        throw new Error(WineCalcI18n.t('errors.positiveValue'));
    }

    if (!volume || volume <= 0) {
        throw new Error(WineCalcI18n.t('errors.volumeRequired'));
    }

    // Typical range for ascorbic acid: 50-100 mg/L
    // Warning if outside typical range
    if (additionRate < 20 || additionRate > 200) {
        console.warn('Addition rate outside typical range (50-100 mg/L)');
    }

    // Formula: Amount (g) = (Volume L × Addition Rate mg/L) / 1000
    // Convert mg to g by dividing by 1000
    const amountG = (volume * additionRate) / 1000;
    const amountKg = amountG / 1000;
    const amountMg = volume * additionRate;

    return {
        amountG: Math.round(amountG * 100) / 100,       // Amount in g (2 decimals)
        amountKg: Math.round(amountKg * 1000) / 1000,   // Amount in kg (3 decimals)
        amountMg: Math.round(amountMg),                  // Amount in mg (0 decimals)
        additionRate: additionRate,                      // Echo back the rate
        volume: volume                                   // Echo back the volume
    };
}

// Export function
window.calculateAscorbicAcid = calculateAscorbicAcid;
