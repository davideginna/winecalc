/* WineCalc - SO2 (Sulfur Dioxide) Calculator */

/**
 * Calculate SO2 addition for wine
 *
 * @param {Object} data - Input data
 * @param {number} data.volume - Volume in liters
 * @param {number} data.currentSO2 - Current SO2 in mg/L
 * @param {number} data.targetSO2 - Target SO2 in mg/L
 * @param {string} data.sulfiteType - Type of sulfite compound
 * @returns {Object} Calculation results
 */
function calculate_so2(data) {
    const { volume, currentSO2, targetSO2, sulfiteType } = data;

    // Validation
    if (!volume || volume <= 0) {
        throw new Error(WineCalcI18n.t('errors.volumeRequired'));
    }

    if (targetSO2 <= currentSO2) {
        throw new Error(WineCalcI18n.t('errors.targetGreaterThanCurrent'));
    }

    // SO2 conversion factors for different sulfite types
    // These represent the fraction of SO2 in each compound
    const sulfiteFactors = {
        potassium_metabisulfite: 0.57,    // K2S2O5 contains 57% SO2
        sodium_metabisulfite: 0.67,        // Na2S2O5 contains 67% SO2
        sulfur_dioxide_gas: 1.0            // Pure SO2 is 100%
    };

    const factor = sulfiteFactors[sulfiteType] || 0.57;

    // Calculate SO2 difference needed
    const so2Difference = targetSO2 - currentSO2;

    // Calculate amount of sulfite compound needed (in grams)
    // Formula: (Volume in L × SO2 difference in mg/L) / (Factor × 1000)
    const sulfiteAmount = (volume * so2Difference) / (factor * 1000);

    // Calculate final SO2 concentration
    const finalSO2 = targetSO2;

    // Additional calculations
    const totalSO2Added = so2Difference * volume / 1000; // in grams

    return {
        amount: Math.round(sulfiteAmount * 100) / 100,           // Sulfite amount in g
        concentration: Math.round(finalSO2 * 10) / 10,           // Final SO2 in mg/L
        totalSO2: Math.round(totalSO2Added * 100) / 100,         // Total SO2 added in g
        sulfiteType: sulfiteType,
        factor: Math.round(factor * 100)                         // Factor as percentage
    };
}

/**
 * Calculate free SO2 from total SO2
 *
 * @param {number} totalSO2 - Total SO2 in mg/L
 * @param {number} pH - Wine pH
 * @returns {number} Estimated free SO2
 */
function calculateFreeSO2(totalSO2, pH) {
    // Simplified estimation: free SO2 is typically 30-50% of total
    // This varies with pH and other wine parameters
    const factor = Math.max(0.3, Math.min(0.5, 0.6 - (pH - 3.0) * 0.1));
    return totalSO2 * factor;
}

/**
 * Calculate molecular SO2 from free SO2 and pH
 *
 * @param {number} freeSO2 - Free SO2 in mg/L
 * @param {number} pH - Wine pH
 * @returns {number} Molecular SO2 in mg/L
 */
function calculateMolecularSO2(freeSO2, pH) {
    // Molecular SO2 calculation using Henderson-Hasselbalch
    // pKa of SO2 is approximately 1.81
    const pKa = 1.81;
    const ratio = 1 / (1 + Math.pow(10, pH - pKa));
    return freeSO2 * ratio;
}

/**
 * Get recommended SO2 levels based on wine type and pH
 *
 * @param {string} wineType - Type of wine (red, white, sweet)
 * @param {number} pH - Wine pH
 * @returns {Object} Recommended SO2 levels
 */
function getRecommendedSO2(wineType, pH) {
    const recommendations = {
        red: {
            low: { total: 30, free: 20, molecular: 0.5 },
            medium: { total: 50, free: 30, molecular: 0.8 },
            high: { total: 80, free: 40, molecular: 0.8 }
        },
        white: {
            low: { total: 50, free: 30, molecular: 0.8 },
            medium: { total: 80, free: 40, molecular: 0.8 },
            high: { total: 120, free: 50, molecular: 0.8 }
        },
        sweet: {
            low: { total: 100, free: 40, molecular: 0.8 },
            medium: { total: 150, free: 60, molecular: 0.8 },
            high: { total: 200, free: 80, molecular: 0.8 }
        }
    };

    // Determine risk level based on pH
    let riskLevel = 'medium';
    if (pH < 3.2) riskLevel = 'low';
    else if (pH > 3.6) riskLevel = 'high';

    return recommendations[wineType]?.[riskLevel] || recommendations.white.medium;
}

// Export function
window.calculate_so2 = calculate_so2;
window.SO2Calculator = {
    calculate: calculate_so2,
    calculateFreeSO2,
    calculateMolecularSO2,
    getRecommendedSO2
};
