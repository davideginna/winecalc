/* WineCalc - Copper Sulfate Addition Calculator (Large Volume) */

/**
 * Calculate copper sulfate (CuSO4·5H2O) addition for large volumes
 * (tank, barrel, or large volume - calculating in weight)
 *
 * Copper sulfate is used to remove hydrogen sulfide (H2S) and mercaptans from wine.
 * CuSO4·5H2O molecular weight: 249.68 g/mol
 * Cu atomic weight: 63.55 g/mol
 * Cu content in CuSO4·5H2O: 25.45%
 *
 * @param {Object} data - Input data
 * @param {number} data.copperRate - Desired addition rate of Cu2+ in mg/L
 * @param {number} data.volume - Volume of wine/ferment in liters
 * @returns {Object} Calculation results
 */
function calculateCopperSulfateLarge(data) {
    const { copperRate, volume } = data;

    // Validation
    if (!copperRate || copperRate <= 0) {
        throw new Error(WineCalcI18n.t('errors.positiveValue'));
    }

    if (!volume || volume <= 0) {
        throw new Error(WineCalcI18n.t('errors.volumeRequired'));
    }

    // Cu content in CuSO4·5H2O is 25.45%
    const CU_PERCENTAGE = 0.2545;

    // Formula: CuSO4·5H2O (g) = (Cu mg/L × Volume L) / (1000 × Cu%)
    // Simplified: CuSO4·5H2O (g) = (Cu mg/L × Volume L) / 254.5
    const copperSulfateG = (copperRate * volume) / (1000 * CU_PERCENTAGE);

    return {
        copperSulfateG: Math.round(copperSulfateG * 100) / 100  // Amount in g (2 decimals)
    };
}

// Export function
window.calculateCopperSulfateLarge = calculateCopperSulfateLarge;
