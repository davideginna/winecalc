/* WineCalc - Fortification Calculator */

/**
 * Calculate alcohol addition for wine fortification
 *
 * @param {Object} data - Input data
 * @param {number} data.volume - Initial wine volume in liters
 * @param {number} data.currentAlcohol - Current alcohol content in %vol
 * @param {number} data.targetAlcohol - Target alcohol content in %vol
 * @param {number} data.spiritStrength - Spirit alcohol strength in %vol (default 96%)
 * @returns {Object} Calculation results
 */
function calculate_fortification(data) {
    const { volume, currentAlcohol, targetAlcohol, spiritStrength = 96 } = data;

    // Validation
    if (!volume || volume <= 0) {
        throw new Error(WineCalcI18n.t('errors.volumeRequired'));
    }

    if (targetAlcohol <= currentAlcohol) {
        throw new Error(WineCalcI18n.t('errors.targetGreaterThanCurrent'));
    }

    if (spiritStrength <= targetAlcohol) {
        throw new Error('Spirit strength must be higher than target alcohol');
    }

    if (currentAlcohol < 0 || currentAlcohol > 100) {
        throw new Error('Current alcohol must be between 0 and 100');
    }

    if (targetAlcohol < 0 || targetAlcohol > 100) {
        throw new Error('Target alcohol must be between 0 and 100');
    }

    // Pearson Square / Algebraic method for fortification
    // Formula: Vs = Vw × (At - Aw) / (As - At)
    // Where:
    //   Vs = Volume of spirit to add
    //   Vw = Volume of wine
    //   At = Target alcohol %
    //   Aw = Wine alcohol %
    //   As = Spirit alcohol %

    const spiritVolume = (volume * (targetAlcohol - currentAlcohol)) /
                        (spiritStrength - targetAlcohol);

    // Calculate final volume
    const finalVolume = volume + spiritVolume;

    // Calculate final alcohol (should equal target)
    const finalAlcohol = ((volume * currentAlcohol) + (spiritVolume * spiritStrength)) / finalVolume;

    // Calculate alcohol added in absolute terms
    const absoluteAlcoholAdded = spiritVolume * (spiritStrength / 100);

    // Calculate dilution factor
    const dilutionFactor = finalVolume / volume;

    return {
        spiritVolume: Math.round(spiritVolume * 1000) / 1000,           // Spirit to add in L
        finalVolume: Math.round(finalVolume * 1000) / 1000,             // Final volume in L
        finalAlcohol: Math.round(finalAlcohol * 100) / 100,             // Final alcohol %vol
        absoluteAlcohol: Math.round(absoluteAlcoholAdded * 1000) / 1000, // Pure alcohol in L
        dilutionFactor: Math.round(dilutionFactor * 1000) / 1000,       // Dilution factor
        spiritStrength: spiritStrength
    };
}

/**
 * Calculate reverse fortification (find current alcohol from volumes)
 *
 * @param {number} wineVolume - Wine volume in L
 * @param {number} spiritVolume - Spirit volume added in L
 * @param {number} finalAlcohol - Final alcohol %vol
 * @param {number} spiritStrength - Spirit strength %vol
 * @returns {number} Original wine alcohol %vol
 */
function calculateReverseAlcohol(wineVolume, spiritVolume, finalAlcohol, spiritStrength) {
    // Reverse formula: Aw = (At × (Vw + Vs) - As × Vs) / Vw
    const totalVolume = wineVolume + spiritVolume;
    const originalAlcohol = (finalAlcohol * totalVolume - spiritStrength * spiritVolume) / wineVolume;

    return Math.round(originalAlcohol * 100) / 100;
}

/**
 * Calculate fortification for specific wine styles
 *
 * @param {string} style - Wine style (port, sherry, madeira, marsala, vdl)
 * @param {number} volume - Wine volume in L
 * @param {number} currentAlcohol - Current alcohol %vol
 * @returns {Object} Fortification recommendations
 */
function getFortificationStyle(style, volume, currentAlcohol) {
    const styles = {
        port: {
            name: 'Port',
            targetAlcohol: 20,
            spiritStrength: 77,
            description: 'Traditional Port-style fortification',
            timing: 'During fermentation (to stop fermentation)'
        },
        sherry: {
            name: 'Sherry',
            targetAlcohol: 15.5,
            spiritStrength: 96,
            description: 'Fino/Manzanilla style',
            timing: 'After fermentation'
        },
        sherry_oloroso: {
            name: 'Sherry (Oloroso)',
            targetAlcohol: 17,
            spiritStrength: 96,
            description: 'Oloroso style',
            timing: 'After fermentation'
        },
        madeira: {
            name: 'Madeira',
            targetAlcohol: 18,
            spiritStrength: 96,
            description: 'Madeira-style fortification',
            timing: 'During or after fermentation'
        },
        marsala: {
            name: 'Marsala',
            targetAlcohol: 18,
            spiritStrength: 95,
            description: 'Marsala-style fortification',
            timing: 'After fermentation'
        },
        vdl: {
            name: 'Vin de Liqueur',
            targetAlcohol: 16,
            spiritStrength: 96,
            description: 'Mistelle/VDL style (fortified must)',
            timing: 'Before fermentation'
        },
        vdn: {
            name: 'Vin Doux Naturel',
            targetAlcohol: 15,
            spiritStrength: 96,
            description: 'VDN style (Muscat, Banyuls)',
            timing: 'During fermentation'
        }
    };

    const selectedStyle = styles[style] || styles.port;

    const calculation = calculate_fortification({
        volume: volume,
        currentAlcohol: currentAlcohol,
        targetAlcohol: selectedStyle.targetAlcohol,
        spiritStrength: selectedStyle.spiritStrength
    });

    return {
        ...calculation,
        style: selectedStyle.name,
        description: selectedStyle.description,
        timing: selectedStyle.timing
    };
}

/**
 * Calculate blending of wines with different alcohol contents
 *
 * @param {number} volume1 - Volume of wine 1 in L
 * @param {number} alcohol1 - Alcohol of wine 1 in %vol
 * @param {number} volume2 - Volume of wine 2 in L
 * @param {number} alcohol2 - Alcohol of wine 2 in %vol
 * @returns {Object} Blending results
 */
function calculateBlending(volume1, alcohol1, volume2, alcohol2) {
    const totalVolume = volume1 + volume2;
    const totalAlcohol = (volume1 * alcohol1 + volume2 * alcohol2) / totalVolume;

    return {
        finalVolume: Math.round(totalVolume * 1000) / 1000,
        finalAlcohol: Math.round(totalAlcohol * 100) / 100,
        proportion1: Math.round((volume1 / totalVolume) * 10000) / 100,
        proportion2: Math.round((volume2 / totalVolume) * 10000) / 100
    };
}

/**
 * Calculate Pearson Square for blending
 * Used to determine proportions of two liquids to achieve target alcohol
 *
 * @param {number} alcohol1 - Alcohol % of component 1
 * @param {number} alcohol2 - Alcohol % of component 2
 * @param {number} targetAlcohol - Desired alcohol %
 * @returns {Object} Pearson square results
 */
function pearsonSquare(alcohol1, alcohol2, targetAlcohol) {
    if (targetAlcohol < Math.min(alcohol1, alcohol2) ||
        targetAlcohol > Math.max(alcohol1, alcohol2)) {
        throw new Error('Target alcohol must be between the two component alcohols');
    }

    const diff1 = Math.abs(targetAlcohol - alcohol2);
    const diff2 = Math.abs(targetAlcohol - alcohol1);
    const total = diff1 + diff2;

    const parts1 = diff1 / total;
    const parts2 = diff2 / total;

    return {
        parts1: Math.round(parts1 * 10000) / 100,  // Percentage
        parts2: Math.round(parts2 * 10000) / 100,  // Percentage
        ratio: `${Math.round(diff1)}:${Math.round(diff2)}`
    };
}

// Export functions
window.calculate_fortification = calculate_fortification;
window.FortificationCalculator = {
    calculate: calculate_fortification,
    calculateReverseAlcohol,
    getFortificationStyle,
    calculateBlending,
    pearsonSquare
};
