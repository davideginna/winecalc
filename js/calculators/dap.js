/* WineCalc - DAP (Diammonium Phosphate) Addition Calculator */

/**
 * Calculate DAP addition for yeast nitrogen nutrition
 *
 * DAP (Diammonium Phosphate - (NH4)2HPO4) is the most common
 * yeast nutrient additive in winemaking. It provides:
 * - Nitrogen for yeast growth and fermentation
 * - Phosphorus for yeast metabolism
 *
 * Typical usage: 20-40 g/hL (prevents stuck fermentations)
 * Maximum legal limit: varies by region (typically 100 g/hL)
 *
 * @param {Object} data - Input data
 * @param {number} data.volume - Must volume in liters
 * @param {number} data.yeastAssimilableNitrogen - YAN in mg/L (optional)
 * @param {number} data.targetYAN - Target YAN in mg/L (optional)
 * @param {number} data.dosage - Direct dosage in g/hL (if not using YAN calculation)
 * @returns {Object} Calculation results
 */
function calculate_dap(data) {
    const { volume, yeastAssimilableNitrogen, targetYAN, dosage } = data;

    // Validation
    if (!volume || isNaN(volume) || volume <= 0) {
        throw new Error(WineCalcI18n.t('errors.volumeRequired'));
    }

    let dapAmount;
    let nitrogenAdded;
    let finalYAN;

    // DAP contains approximately 21% nitrogen by weight
    const DAP_NITROGEN_CONTENT = 0.21; // 21% N
    const DAP_NITROGEN_MG_PER_G = 210; // mg N per gram DAP

    if (dosage) {
        // Direct dosage calculation
        if (dosage <= 0) {
            throw new Error(WineCalcI18n.t('errors.positiveValue'));
        }

        const volumeHl = volume / 100;
        dapAmount = dosage * volumeHl;
        nitrogenAdded = (dapAmount * DAP_NITROGEN_MG_PER_G) / volume;
        finalYAN = (yeastAssimilableNitrogen || 0) + nitrogenAdded;

    } else if (yeastAssimilableNitrogen !== undefined && targetYAN !== undefined) {
        // YAN-based calculation
        if (targetYAN <= yeastAssimilableNitrogen) {
            throw new Error('Target YAN must be greater than current YAN');
        }

        // Calculate nitrogen needed
        const nitrogenNeeded = targetYAN - yeastAssimilableNitrogen; // mg/L

        // Calculate total nitrogen needed for volume
        const totalNitrogenNeeded = nitrogenNeeded * volume; // mg

        // Calculate DAP needed
        dapAmount = totalNitrogenNeeded / DAP_NITROGEN_MG_PER_G; // grams

        nitrogenAdded = nitrogenNeeded;
        finalYAN = targetYAN;

    } else {
        throw new Error('Either provide dosage or both current YAN and target YAN');
    }

    // Convert to hectoliters for dosage rate
    const dosageRate = (dapAmount / (volume / 100));

    // Legal and safety checks
    const maxLegalDosage = 100; // g/hL (typical EU limit)
    const recommendedMaxDosage = 40; // g/hL (best practice)
    const isLegal = dosageRate <= maxLegalDosage;
    const isRecommended = dosageRate <= recommendedMaxDosage;

    return {
        dapAmount: Math.round(dapAmount * 10) / 10,
        dapAmountKg: Math.round(dapAmount / 10) / 100,
        dosageRate: Math.round(dosageRate * 10) / 10,
        nitrogenAdded: Math.round(nitrogenAdded * 10) / 10,
        finalYAN: Math.round(finalYAN),
        isLegal: isLegal,
        isRecommended: isRecommended,
        maxLegal: maxLegalDosage,
        maxRecommended: recommendedMaxDosage,
        applicationTiming: getDAPApplicationTiming(),
        notes: getDAPNotes(dosageRate, finalYAN)
    };
}

/**
 * Get DAP application timing recommendations
 */
function getDAPApplicationTiming() {
    return {
        firstAddition: {
            timing: 'At yeast inoculation or within first 24 hours',
            amount: '50% of total dose',
            reason: 'Supports initial yeast growth phase'
        },
        secondAddition: {
            timing: 'At 1/3 sugar depletion (around 1.060 SG)',
            amount: '50% of total dose',
            reason: 'Maintains fermentation momentum, prevents stuck fermentation'
        },
        warning: 'Do not add after 1/2 sugar depletion - can produce unwanted hydrogen sulfide (H2S)'
    };
}

/**
 * Get notes and warnings based on dosage and YAN
 */
function getDAPNotes(dosageRate, finalYAN) {
    const notes = [];

    // Dosage warnings
    if (dosageRate > 100) {
        notes.push('⚠️ ILLEGAL: Dosage exceeds legal maximum in most regions');
    } else if (dosageRate > 60) {
        notes.push('⚠️ WARNING: Very high dosage may cause off-flavors and excessive foaming');
    } else if (dosageRate > 40) {
        notes.push('⚠️ CAUTION: High dosage - consider using complex yeast nutrients instead');
    } else if (dosageRate >= 20) {
        notes.push('✓ Standard dosage range for most fermentations');
    } else {
        notes.push('ℹ️ Low dosage - suitable for musts with adequate natural YAN');
    }

    // YAN level warnings
    if (finalYAN) {
        if (finalYAN < 140) {
            notes.push('⚠️ Final YAN still below minimum (140 mg/L) - risk of stuck fermentation');
        } else if (finalYAN >= 140 && finalYAN <= 200) {
            notes.push('✓ Adequate YAN for most white wine fermentations');
        } else if (finalYAN > 200 && finalYAN <= 300) {
            notes.push('✓ Good YAN level for red wines and high-alcohol fermentations');
        } else {
            notes.push('⚠️ Very high YAN - may lead to excessive yeast growth and off-flavors');
        }
    }

    return notes.join('\n');
}

/**
 * Calculate YAN from lab analysis
 *
 * @param {Object} data
 * @param {number} data.primaryAminoNitrogen - PAN/NOPA in mg/L (from lab)
 * @param {number} data.ammoniumNitrogen - Ammonia nitrogen in mg/L (from lab)
 * @returns {number} Total YAN in mg/L
 */
function calculateYAN(data) {
    const { primaryAminoNitrogen, ammoniumNitrogen } = data;
    return primaryAminoNitrogen + ammoniumNitrogen;
}

/**
 * Estimate YAN from grape variety and Brix (rough approximation)
 */
function estimateYANFromGrapes(data) {
    const { variety, brix } = data;

    // Base YAN by variety (very rough estimates)
    const baseYAN = {
        'chardonnay': 180,
        'sauvignon_blanc': 200,
        'riesling': 160,
        'pinot_noir': 140,
        'cabernet_sauvignon': 150,
        'merlot': 160,
        'syrah': 170,
        'default': 160
    };

    const base = baseYAN[variety?.toLowerCase()] || baseYAN.default;

    // Adjust for sugar level (higher Brix = more dilution = lower YAN)
    const brixAdjustment = brix ? (25 - brix) * 5 : 0;

    return Math.max(100, base + brixAdjustment);
}

/**
 * Complex nutrient alternatives to DAP
 */
const NUTRIENT_ALTERNATIVES = {
    dap: {
        name: 'DAP (Diammonium Phosphate)',
        nitrogen: 'High (21% N)',
        type: 'Inorganic',
        advantages: ['Cheap', 'Fast-acting', 'Highly soluble'],
        disadvantages: ['Only provides nitrogen', 'Can cause H2S if added late', 'May produce harsh fermentations']
    },
    fermaidK: {
        name: 'Fermaid K',
        nitrogen: 'Medium (~10% YAN)',
        type: 'Complex (organic + inorganic)',
        advantages: ['Balanced nutrition', 'Contains amino acids, vitamins, minerals', 'Slower release'],
        disadvantages: ['More expensive', 'Lower N content than DAP']
    },
    fermaidO: {
        name: 'Fermaid O',
        nitrogen: 'Medium',
        type: 'Organic (inactivated yeast)',
        advantages: ['All organic nitrogen', 'Rich in amino acids', 'Good for aromatic complexity'],
        disadvantages: ['Most expensive', 'Slower acting']
    },
    goFerm: {
        name: 'Go-Ferm',
        nitrogen: 'Low',
        type: 'Rehydration nutrient',
        advantages: ['Protects yeast during rehydration', 'Improves fermentation kinetics'],
        disadvantages: ['Not for mid-fermentation', 'Must be used during rehydration']
    }
};

/**
 * YAN requirements by wine style
 */
const YAN_REQUIREMENTS = {
    white_low_alcohol: {
        style: 'Light white wines (<12% ABV)',
        minimumYAN: 140,
        optimalYAN: 180,
        notes: 'Lower YAN to preserve delicate aromatics'
    },
    white_standard: {
        style: 'Standard white wines (12-13% ABV)',
        minimumYAN: 140,
        optimalYAN: 200,
        notes: 'Adequate YAN for clean fermentation'
    },
    red_standard: {
        style: 'Red wines (13-14% ABV)',
        minimumYAN: 140,
        optimalYAN: 250,
        notes: 'Higher YAN for complete fermentation and color extraction'
    },
    high_alcohol: {
        style: 'High-alcohol wines (>14% ABV)',
        minimumYAN: 200,
        optimalYAN: 300,
        notes: 'High YAN critical to prevent stuck fermentation in high-sugar musts'
    },
    sparkling: {
        style: 'Sparkling wine base',
        minimumYAN: 150,
        optimalYAN: 200,
        notes: 'Adequate YAN for primary and secondary fermentation'
    }
};

// Export functions
window.calculate_dap = calculate_dap;
window.DAPCalculator = {
    calculate: calculate_dap,
    calculateYAN: calculateYAN,
    estimateYANFromGrapes: estimateYANFromGrapes,
    NUTRIENT_ALTERNATIVES: NUTRIENT_ALTERNATIVES,
    YAN_REQUIREMENTS: YAN_REQUIREMENTS
};
