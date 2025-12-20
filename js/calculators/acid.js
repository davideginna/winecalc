/* WineCalc - Acid Addition Calculator */

/**
 * Calculate acid addition for wine
 *
 * @param {Object} data - Input data
 * @param {number} data.volume - Volume in liters
 * @param {number} data.currentTA - Current total acidity in g/L (as tartaric acid)
 * @param {number} data.targetTA - Target total acidity in g/L (as tartaric acid)
 * @param {string} data.acidType - Type of acid (tartaric, citric, malic)
 * @returns {Object} Calculation results
 */
function calculate_acid(data) {
    const { volume, currentTA, targetTA, acidType } = data;

    // Validation
    if (!volume || volume <= 0) {
        throw new Error(WineCalcI18n.t('errors.volumeRequired'));
    }

    if (targetTA <= currentTA) {
        throw new Error(WineCalcI18n.t('errors.targetGreaterThanCurrent'));
    }

    // Acid equivalence factors (relative to tartaric acid)
    // These represent how much of each acid is needed to achieve the same acidity as tartaric
    const acidFactors = {
        tartaric: 1.0,      // Tartaric acid (reference)
        citric: 0.70,       // Citric acid is 70% as acidic as tartaric
        malic: 0.90         // Malic acid is 90% as acidic as tartaric
    };

    // Acid molecular weights
    const molecularWeights = {
        tartaric: 150.09,
        citric: 192.12,
        malic: 134.09
    };

    const factor = acidFactors[acidType] || 1.0;

    // Calculate acidity difference needed
    const acidityDifference = targetTA - currentTA;

    // Calculate amount of acid needed (in grams)
    // Formula: Volume (L) × Acidity difference (g/L) / Factor
    const acidAmount = (volume * acidityDifference) / factor;

    // Calculate final total acidity
    const finalTA = targetTA;

    // Calculate pH estimate (simplified)
    const estimatedPH = estimatePH(finalTA);

    return {
        amount: Math.round(acidAmount * 100) / 100,              // Acid amount in g
        finalTA: Math.round(finalTA * 100) / 100,                // Final TA in g/L
        acidType: acidType,
        amountPerLiter: Math.round((acidAmount / volume) * 100) / 100,  // g/L to add
        estimatedPH: Math.round(estimatedPH * 100) / 100        // Estimated pH
    };
}

/**
 * Calculate deacidification (acid removal)
 *
 * @param {number} volume - Volume in liters
 * @param {number} currentTA - Current total acidity in g/L
 * @param {number} targetTA - Target total acidity in g/L
 * @param {string} method - Deacidification method (carbonate, bicarbonate, double_salt)
 * @returns {Object} Calculation results
 */
function calculateDeacidification(volume, currentTA, targetTA, method = 'carbonate') {
    if (targetTA >= currentTA) {
        throw new Error('Target acidity must be lower than current for deacidification');
    }

    // Deacidification factors (g of compound per g/L of acidity to reduce)
    const deacidFactors = {
        carbonate: 0.67,        // Potassium carbonate (K2CO3)
        bicarbonate: 0.84,      // Potassium bicarbonate (KHCO3)
        double_salt: 2.00       // Calcium carbonate double salt (Acidex)
    };

    const factor = deacidFactors[method] || 0.67;

    const acidityReduction = currentTA - targetTA;
    const compoundAmount = volume * acidityReduction * factor;

    return {
        amount: Math.round(compoundAmount * 100) / 100,
        finalTA: Math.round(targetTA * 100) / 100,
        method: method,
        acidityReduced: Math.round(acidityReduction * 100) / 100
    };
}

/**
 * Estimate pH from total acidity
 * Note: This is a rough estimation. Actual pH depends on many factors.
 *
 * @param {number} totalAcidity - Total acidity in g/L as tartaric
 * @returns {number} Estimated pH
 */
function estimatePH(totalAcidity) {
    // Simplified inverse relationship: higher acidity = lower pH
    // Typical wine pH range: 3.0 - 4.0
    // Typical TA range: 4.0 - 9.0 g/L

    // Linear approximation (not accurate for all wines)
    // pH ≈ 4.5 - (0.2 × TA)
    const estimatedPH = 4.5 - (0.2 * totalAcidity);

    // Clamp to reasonable wine pH range
    return Math.max(2.8, Math.min(4.2, estimatedPH));
}

/**
 * Calculate total acidity from pH
 * Note: This is a rough estimation
 *
 * @param {number} pH - Wine pH
 * @returns {number} Estimated total acidity in g/L
 */
function estimateTAFromPH(pH) {
    // Inverse of estimatePH formula
    // TA ≈ (4.5 - pH) / 0.2
    const estimatedTA = (4.5 - pH) / 0.2;

    // Clamp to reasonable TA range
    return Math.max(3.0, Math.min(12.0, estimatedTA));
}

/**
 * Convert between acidity units
 *
 * @param {number} value - Acidity value
 * @param {string} fromUnit - Source unit (tartaric, sulfuric, citric, etc.)
 * @param {string} toUnit - Target unit
 * @returns {number} Converted value
 */
function convertAcidityUnits(value, fromUnit, toUnit) {
    // Conversion factors to tartaric acid equivalent
    const toTartaric = {
        tartaric: 1.0,
        sulfuric: 1.53,      // 1 g/L H2SO4 = 1.53 g/L tartaric
        citric: 0.78,        // 1 g/L citric = 0.78 g/L tartaric
        malic: 1.12,         // 1 g/L malic = 1.12 g/L tartaric
        lactic: 1.67,        // 1 g/L lactic = 1.67 g/L tartaric
        acetic: 2.50         // 1 g/L acetic = 2.50 g/L tartaric
    };

    // First convert to tartaric, then to target unit
    const asTartaric = value * (toTartaric[fromUnit] || 1.0);
    const result = asTartaric / (toTartaric[toUnit] || 1.0);

    return Math.round(result * 100) / 100;
}

/**
 * Get recommended acidity range for wine type
 *
 * @param {string} wineType - Type of wine (red, white, rose, sparkling)
 * @returns {Object} Recommended TA range
 */
function getRecommendedAcidity(wineType) {
    const recommendations = {
        red: {
            min: 5.5,
            optimal: 6.0,
            max: 7.0,
            pH: { min: 3.3, max: 3.6 }
        },
        white: {
            min: 6.0,
            optimal: 7.0,
            max: 9.0,
            pH: { min: 3.0, max: 3.4 }
        },
        rose: {
            min: 5.5,
            optimal: 6.5,
            max: 8.0,
            pH: { min: 3.1, max: 3.5 }
        },
        sparkling: {
            min: 7.0,
            optimal: 8.0,
            max: 10.0,
            pH: { min: 2.9, max: 3.2 }
        },
        sweet: {
            min: 6.0,
            optimal: 7.5,
            max: 9.5,
            pH: { min: 3.2, max: 3.8 }
        }
    };

    return recommendations[wineType] || recommendations.white;
}

// Export functions
window.calculate_acid = calculate_acid;
window.AcidCalculator = {
    calculate: calculate_acid,
    calculateDeacidification,
    estimatePH,
    estimateTAFromPH,
    convertAcidityUnits,
    getRecommendedAcidity
};
