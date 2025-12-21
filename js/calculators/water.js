/* WineCalc - Water Addition Calculator */

/**
 * Calculate water addition for dilution of wine parameters
 *
 * Water addition can be used to reduce:
 * - Alcohol content
 * - Sugar levels
 * - Total acidity
 * - Tannin concentration
 *
 * Note: Water addition is regulated and may not be permitted
 * in all wine regions. Check local legislation.
 *
 * @param {Object} data - Input data
 * @param {number} data.volume - Initial wine volume in liters
 * @param {number} data.currentValue - Current parameter value
 * @param {number} data.targetValue - Target parameter value
 * @param {string} data.parameter - Parameter being diluted (alcohol, sugar, acidity, etc.)
 * @returns {Object} Calculation results
 */
function calculate_water(data) {
    const { volume, currentValue, targetValue, parameter } = data;

    // Validation
    if (!volume || isNaN(volume) || volume <= 0) {
        throw new Error(WineCalcI18n.t('errors.volumeRequired'));
    }

    if (!currentValue || isNaN(currentValue) || currentValue <= 0) {
        throw new Error(WineCalcI18n.t('errors.positiveValue'));
    }

    if (!targetValue || isNaN(targetValue) || targetValue <= 0) {
        throw new Error(WineCalcI18n.t('errors.positiveValue'));
    }

    if (targetValue >= currentValue) {
        throw new Error('Target value must be lower than current value for dilution');
    }

    // Calculate water volume needed using dilution formula
    // C1 × V1 = C2 × V2
    // Where: C1 = current concentration, V1 = current volume
    //        C2 = target concentration, V2 = final volume
    //
    // Solving for water to add:
    // Water = V2 - V1 = (C1 × V1 / C2) - V1

    const finalVolume = (currentValue * volume) / targetValue;
    const waterToAdd = finalVolume - volume;

    // Calculate percentage dilution
    const dilutionPercent = (waterToAdd / volume) * 100;

    // Calculate final concentration (should equal target)
    const finalConcentration = (currentValue * volume) / finalVolume;

    // Maximum recommended dilution is typically 20%
    const maxRecommendedDilution = 20;
    const isWithinRecommendation = dilutionPercent <= maxRecommendedDilution;

    return {
        waterVolume: Math.round(waterToAdd * 100) / 100,
        finalVolume: Math.round(finalVolume * 100) / 100,
        finalConcentration: Math.round(finalConcentration * 100) / 100,
        dilutionPercent: Math.round(dilutionPercent * 10) / 10,
        isWithinRecommendation: isWithinRecommendation,
        maxRecommended: maxRecommendedDilution,
        parameter: parameter,
        warning: getWaterAdditionWarning(dilutionPercent, parameter),
        legalNote: 'Check local regulations - water addition may not be permitted in your region'
    };
}

/**
 * Get warning message based on dilution amount and parameter
 */
function getWaterAdditionWarning(dilutionPercent, parameter) {
    if (dilutionPercent > 25) {
        return 'WARNING: Very high dilution (>25%). This will significantly impact wine quality and may not be legal.';
    } else if (dilutionPercent > 20) {
        return 'CAUTION: High dilution (>20%). This may noticeably affect wine body, flavor, and mouthfeel.';
    } else if (dilutionPercent > 10) {
        return 'Moderate dilution. Some impact on wine structure expected.';
    } else {
        return 'Minor dilution. Minimal impact on wine character.';
    }
}

/**
 * Calculate water addition to reduce alcohol specifically
 * Uses more precise calculation considering alcohol density
 *
 * @param {Object} data
 * @param {number} data.volume - Wine volume in liters
 * @param {number} data.currentAlcohol - Current alcohol % vol
 * @param {number} data.targetAlcohol - Target alcohol % vol
 * @returns {Object} Results with alcohol-specific calculations
 */
function calculateAlcoholReduction(data) {
    const { volume, currentAlcohol, targetAlcohol } = data;

    // Basic dilution calculation
    const basicResult = calculate_water({
        volume: volume,
        currentValue: currentAlcohol,
        targetValue: targetAlcohol,
        parameter: 'alcohol'
    });

    // Alcohol reduction in percentage points
    const alcoholReduction = currentAlcohol - targetAlcohol;

    // Estimate impact on wine
    const qualityImpact = getAlcoholReductionImpact(basicResult.dilutionPercent);

    return {
        ...basicResult,
        alcoholReduction: Math.round(alcoholReduction * 10) / 10,
        qualityImpact: qualityImpact,
        alternativeMethods: [
            'Reverse osmosis (professional equipment)',
            'Spinning cone column (professional equipment)',
            'Early harvest (preventive measure)',
            'Blending with lower alcohol wine'
        ]
    };
}

/**
 * Get quality impact assessment for alcohol reduction
 */
function getAlcoholReductionImpact(dilutionPercent) {
    if (dilutionPercent <= 5) {
        return {
            level: 'Minimal',
            effects: ['Slight reduction in body', 'Minimal flavor impact']
        };
    } else if (dilutionPercent <= 10) {
        return {
            level: 'Moderate',
            effects: ['Noticeable reduction in body', 'Some flavor dilution', 'Reduced mouthfeel']
        };
    } else if (dilutionPercent <= 15) {
        return {
            level: 'Significant',
            effects: ['Major body reduction', 'Noticeable flavor dilution', 'Thinner mouthfeel', 'Possible color lightening']
        };
    } else {
        return {
            level: 'Severe',
            effects: ['Substantial quality loss', 'Watery character', 'Faded flavors and aromas', 'Thin, unbalanced wine']
        };
    }
}

/**
 * Calculate water addition to reduce acidity
 *
 * @param {Object} data
 * @param {number} data.volume - Wine volume in liters
 * @param {number} data.currentTA - Current total acidity in g/L
 * @param {number} data.targetTA - Target total acidity in g/L
 * @returns {Object} Results with acidity-specific notes
 */
function calculateAcidityReduction(data) {
    const { volume, currentTA, targetTA } = data;

    const result = calculate_water({
        volume: volume,
        currentValue: currentTA,
        targetValue: targetTA,
        parameter: 'acidity'
    });

    return {
        ...result,
        acidityReduction: Math.round((currentTA - targetTA) * 10) / 10,
        note: 'Consider chemical deacidification as alternative to preserve wine structure',
        alternatives: [
            'Potassium bicarbonate addition',
            'Calcium carbonate addition',
            'Malolactic fermentation (biological deacidification)'
        ]
    };
}

/**
 * Water quality guidelines for winemaking
 */
const WATER_QUALITY_GUIDELINES = {
    general: 'Use only potable, microbiologically stable water',
    chlorine: 'Chlorine-free (or use activated carbon filter)',
    hardness: 'Preferably soft water (low calcium/magnesium)',
    iron: 'Low iron content (<0.3 mg/L)',
    treatment: 'Consider UV treatment or sterile filtration',
    temperature: 'Same temperature as wine to avoid temperature shock'
};

/**
 * Legal regulations by region (general guidance)
 */
const LEGAL_NOTES = {
    eu: 'Generally prohibited except in specific circumstances with authorization',
    usa: 'Permitted in some states, prohibited in others. Check TTB regulations',
    australia: 'Permitted with restrictions and record-keeping requirements',
    newZealand: 'Generally not permitted',
    southAfrica: 'Permitted with limitations',
    note: 'Always verify current regulations in your specific region'
};

// Export functions
window.calculate_water = calculate_water;
window.WaterCalculator = {
    calculate: calculate_water,
    calculateAlcoholReduction: calculateAlcoholReduction,
    calculateAcidityReduction: calculateAcidityReduction,
    WATER_QUALITY_GUIDELINES: WATER_QUALITY_GUIDELINES,
    LEGAL_NOTES: LEGAL_NOTES
};
