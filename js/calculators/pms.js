/* WineCalc - Potassium Metabisulphite (PMS) Addition Calculator */

/**
 * Calculate Potassium Metabisulphite (K2S2O5) addition for wine/juice
 *
 * Formula: PMS (g) = (SO2 rate × Volume) / 570
 *
 * This formula assumes that 100% of a PMS solution liberates 57% as SO2
 * Therefore: 1000mg / 0.57 = ~570
 *
 * @param {Object} data - Input data
 * @param {number} data.so2Rate - Desired addition rate as SO2 in mg/L
 * @param {number} data.volume - Volume of wine/juice in liters
 * @returns {Object} Calculation results
 */
function calculatePms(data) {
    const { so2Rate, volume } = data;

    // Validation
    if (!volume || isNaN(volume) || volume <= 0) {
        throw new Error(WineCalcI18n.t('errors.volumeRequired'));
    }

    if (!so2Rate || isNaN(so2Rate) || so2Rate <= 0) {
        throw new Error(WineCalcI18n.t('errors.positiveValue'));
    }

    // Formula: PMS (g) = (SO2 rate mg/L × Volume L) / 570
    // 570 comes from: 1000 / 0.57 (PMS liberates 57% as SO2)
    const pmsGrams = (so2Rate * volume) / 570;

    return {
        pmsGrams: Math.round(pmsGrams * 100) / 100,  // Amount in grams (2 decimals)
        so2Rate: so2Rate,                             // Echo back the rate
        volume: volume                                // Echo back the volume
    };
}

// Export function
window.calculatePms = calculatePms;
