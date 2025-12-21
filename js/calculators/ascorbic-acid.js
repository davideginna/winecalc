/* WineCalc - Ascorbic Acid Addition Calculator */

/**
 * Calculate ascorbic acid (Vitamin C) addition for wine protection
 *
 * Ascorbic acid (C6H8O6) is used as an antioxidant in winemaking to:
 * - Protect wine from oxidation (in combination with SO2)
 * - Preserve fresh fruit aromas
 * - Prevent browning in white wines
 *
 * IMPORTANT: Must be used WITH adequate SO2. Alone, ascorbic acid
 * can cause oxidation and browning.
 *
 * Typical dosage: 5-20 g/hL
 * Maximum legal limit: varies by region (typically 25 g/hL)
 *
 * @param {Object} data - Input data
 * @param {number} data.volume - Wine volume in liters
 * @param {number} data.dosage - Dosage in g/hL (or mg/L)
 * @param {string} data.unit - Unit of dosage ('g/hl' or 'mg/l')
 * @param {number} data.currentSO2 - Current free SO2 in mg/L (for safety check)
 * @returns {Object} Calculation results
 */
function calculate_ascorbic_acid(data) {
    let { volume, dosage, unit, currentSO2 } = data;

    // Validation
    if (!volume || isNaN(volume) || volume <= 0) {
        throw new Error(WineCalcI18n.t('errors.volumeRequired'));
    }

    if (!dosage || isNaN(dosage) || dosage <= 0) {
        throw new Error(WineCalcI18n.t('errors.positiveValue'));
    }

    // Default unit to g/hL if not specified
    unit = unit || 'g/hl';

    // Convert dosage to g/hL if provided in mg/L
    let dosageGPerHL;
    if (unit === 'mg/l') {
        dosageGPerHL = dosage / 10; // 1 g/hL = 10 mg/L
    } else {
        dosageGPerHL = dosage;
    }

    // Calculate amount needed
    const volumeHL = volume / 100;
    const ascorbicAmount = dosageGPerHL * volumeHL;

    // Convert to mg/L for reference
    const concentrationMgL = dosageGPerHL * 10;

    // Legal and safety limits
    const maxLegalDosage = 25; // g/hL (typical EU limit)
    const recommendedMaxDosage = 20; // g/hL
    const recommendedMinDosage = 5; // g/hL
    const isLegal = dosageGPerHL <= maxLegalDosage;
    const isInRecommendedRange = dosageGPerHL >= recommendedMinDosage &&
                                  dosageGPerHL <= recommendedMaxDosage;

    // SO2 requirement check
    const minRequiredSO2 = 20; // mg/L free SO2 minimum
    const hasSufficientSO2 = currentSO2 >= minRequiredSO2;

    // Calculate SO2 consumption (ascorbic acid will reduce free SO2)
    // Approximately 1 mg/L ascorbic acid binds 0.5 mg/L SO2
    const estimatedSO2Consumption = concentrationMgL * 0.5;
    const estimatedFinalSO2 = (currentSO2 || 0) - estimatedSO2Consumption;

    return {
        ascorbicAmount: Math.round(ascorbicAmount * 100) / 100,
        ascorbicAmountMg: Math.round(ascorbicAmount * 1000),
        dosageRate: Math.round(dosageGPerHL * 10) / 10,
        concentrationMgL: Math.round(concentrationMgL),
        isLegal: isLegal,
        isInRecommendedRange: isInRecommendedRange,
        hasSufficientSO2: hasSufficientSO2,
        minRequiredSO2: minRequiredSO2,
        currentSO2: currentSO2 || 0,
        estimatedSO2Consumption: Math.round(estimatedSO2Consumption),
        estimatedFinalSO2: Math.round(estimatedFinalSO2),
        timing: getAscorbicAcidTiming(),
        warnings: getAscorbicAcidWarnings(dosageGPerHL, currentSO2, estimatedFinalSO2),
        notes: getAscorbicAcidNotes()
    };
}

/**
 * Get optimal timing for ascorbic acid addition
 */
function getAscorbicAcidTiming() {
    return {
        preferredTiming: 'At bottling',
        reason: 'Maximum protection during most vulnerable period',
        alternatives: [
            {
                timing: 'After racking',
                suitability: 'Good for short-term storage before bottling'
            },
            {
                timing: 'After fining',
                suitability: 'Protects wine after exposure to air during fining'
            }
        ],
        avoid: [
            'Do not add during fermentation (yeast will consume it)',
            'Do not add to wine without adequate SO2',
            'Do not add to heavily oxidized wine (will worsen oxidation)'
        ]
    };
}

/**
 * Get warnings based on dosage and SO2 levels
 */
function getAscorbicAcidWarnings(dosage, currentSO2, estimatedFinalSO2) {
    const warnings = [];

    // Dosage warnings
    if (dosage > 25) {
        warnings.push({
            level: 'ERROR',
            message: 'Dosage exceeds legal maximum in most regions (25 g/hL)'
        });
    } else if (dosage > 20) {
        warnings.push({
            level: 'WARNING',
            message: 'High dosage - may cause off-flavors and haze formation'
        });
    } else if (dosage < 5) {
        warnings.push({
            level: 'INFO',
            message: 'Low dosage - may provide minimal antioxidant protection'
        });
    }

    // SO2 warnings
    if (!currentSO2 || currentSO2 === 0) {
        warnings.push({
            level: 'CRITICAL',
            message: '⚠️ DANGER: No SO2 data provided! Ascorbic acid WITHOUT SO2 will CAUSE oxidation and browning!'
        });
    } else if (currentSO2 < 20) {
        warnings.push({
            level: 'CRITICAL',
            message: `⚠️ INSUFFICIENT SO2 (${currentSO2} mg/L)! Minimum 20 mg/L free SO2 required. Add SO2 before ascorbic acid!`
        });
    } else if (estimatedFinalSO2 < 15) {
        warnings.push({
            level: 'WARNING',
            message: `SO2 will drop to ${estimatedFinalSO2} mg/L after ascorbic acid addition. Consider adding more SO2.`
        });
    } else {
        warnings.push({
            level: 'OK',
            message: `✓ Adequate SO2 protection (${currentSO2} mg/L). Ascorbic acid can be safely added.`
        });
    }

    return warnings;
}

/**
 * Get general notes about ascorbic acid usage
 */
function getAscorbicAcidNotes() {
    return {
        mechanism: 'Ascorbic acid acts as a sacrificial antioxidant, being oxidized instead of wine compounds',
        synergy: 'Works synergistically with SO2 - BOTH must be present for effective protection',
        wineTypes: {
            white: 'Highly recommended for white and rosé wines to preserve freshness',
            red: 'Less common in red wines (tannins provide antioxidant protection)',
            aromatic: 'Especially beneficial for aromatic varieties (Riesling, Sauvignon Blanc, Gewürztraminer)'
        },
        stability: 'Ascorbic acid is consumed over time - not a permanent protection',
        storage: 'Store ascorbic acid powder in cool, dark, dry place. Degrades in light and heat',
        dissolution: 'Dissolve in small amount of wine or water before adding to prevent localized high concentrations'
    };
}

/**
 * Calculate ascorbic acid dosage based on wine style
 */
function recommendDosageByStyle(wineStyle) {
    const recommendations = {
        'young_white': {
            style: 'Young, fresh white wines',
            dosage: '10-15 g/hL',
            reason: 'Maximum fruit preservation'
        },
        'oak_aged_white': {
            style: 'Oak-aged white wines',
            dosage: '5-10 g/hL',
            reason: 'Moderate protection, oak provides some antioxidants'
        },
        'rose': {
            style: 'Rosé wines',
            dosage: '10-15 g/hL',
            reason: 'Color and freshness preservation'
        },
        'aromatic_white': {
            style: 'Aromatic whites (Riesling, Gewürz, SB)',
            dosage: '15-20 g/hL',
            reason: 'Maximum aroma protection'
        },
        'red': {
            style: 'Red wines',
            dosage: '0-5 g/hL',
            reason: 'Usually not needed, tannins provide protection'
        },
        'sparkling': {
            style: 'Sparkling wines',
            dosage: '10-15 g/hL',
            reason: 'Protection during and after tirage'
        }
    };

    return recommendations[wineStyle] || recommendations['young_white'];
}

/**
 * Ascorbic acid degradation over time
 * Returns estimated remaining ascorbic acid after storage
 */
function calculateDegradation(data) {
    const { initialDosage, monthsStored, temperature, so2Level } = data;

    // Degradation rate varies with temperature and SO2
    // Rough approximation: 10-20% loss per month at room temp
    // 5-10% loss per month at cellar temp with good SO2

    let monthlyDegradationPercent;
    if (temperature > 20) {
        monthlyDegradationPercent = 15 + (temperature - 20) * 2;
    } else {
        monthlyDegradationPercent = so2Level > 20 ? 7 : 12;
    }

    const remainingPercent = Math.max(0, 100 - (monthlyDegradationPercent * monthsStored));
    const remainingDosage = (initialDosage * remainingPercent) / 100;

    return {
        initialDosage: initialDosage,
        monthsStored: monthsStored,
        degradationRate: monthlyDegradationPercent,
        remainingPercent: Math.round(remainingPercent),
        remainingDosage: Math.round(remainingDosage * 10) / 10,
        isStillEffective: remainingPercent > 30,
        recommendation: remainingPercent < 30 ? 'Consider additional SO2 protection' : 'Still providing protection'
    };
}

// Export functions
window.calculate_ascorbic_acid = calculate_ascorbic_acid;
window.AscorbicAcidCalculator = {
    calculate: calculate_ascorbic_acid,
    recommendDosageByStyle: recommendDosageByStyle,
    calculateDegradation: calculateDegradation
};
