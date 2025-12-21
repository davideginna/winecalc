/* WineCalc - Bentonite Addition Calculator */

/**
 * Calculate bentonite addition for wine fining
 *
 * Bentonite is a clay mineral used to remove unstable proteins from wine
 * that can cause haze. Standard dosage ranges from 20-100 g/hL.
 *
 * @param {Object} data - Input data
 * @param {number} data.volume - Wine volume in liters
 * @param {number} data.dosage - Bentonite dosage in g/hL (grams per hectoliter)
 * @returns {Object} Calculation results
 */
function calculate_bentonite(data) {
    const { volume, dosage } = data;

    // Validation
    if (!volume || isNaN(volume) || volume <= 0) {
        throw new Error(WineCalcI18n.t('errors.volumeRequired'));
    }

    if (!dosage || isNaN(dosage) || dosage <= 0) {
        throw new Error(WineCalcI18n.t('errors.positiveValue'));
    }

    // Typical dosage range check
    if (dosage < 10 || dosage > 150) {
        console.warn('Bentonite dosage outside typical range (20-100 g/hL)');
    }

    // Convert volume to hectoliters for calculation
    const volumeHl = volume / 100;

    // Calculate bentonite amount needed (in grams)
    const bentoniteAmount = dosage * volumeHl;

    // Calculate water needed for hydration
    // Typical ratio: 1 part bentonite to 10 parts water
    // This creates a slurry that's easier to mix into wine
    const waterAmount = bentoniteAmount * 10;

    // Settling time estimate (typically 5-10 days)
    const settlingTimeDays = 7;

    // Expected protein removal (bentonite is very effective)
    const proteinRemovalPercent = 85;

    return {
        bentoniteAmount: Math.round(bentoniteAmount * 10) / 10,
        waterAmount: Math.round(waterAmount),
        bentoniteAmountKg: Math.round(bentoniteAmount / 10) / 100,
        waterAmountL: Math.round(waterAmount / 10) / 100,
        settlingTime: settlingTimeDays,
        proteinRemoval: proteinRemovalPercent,
        dosageRate: dosage,
        notes: getBentoniteNotes(dosage)
    };
}

/**
 * Get bentonite usage notes based on dosage
 */
function getBentoniteNotes(dosage) {
    if (dosage < 20) {
        return 'Low dosage - suitable for wines with minimal protein instability';
    } else if (dosage <= 50) {
        return 'Standard dosage - suitable for most white wines';
    } else if (dosage <= 80) {
        return 'High dosage - for wines with significant protein haze risk';
    } else {
        return 'Very high dosage - may strip wine color and body. Consider bench trials first';
    }
}

/**
 * Calculate bentonite requirement from bench trial
 *
 * @param {Object} data
 * @param {number} data.trialVolume - Trial volume in mL
 * @param {number} data.bentoniteUsed - Bentonite used in trial in grams
 * @param {number} data.targetVolume - Target wine volume in liters
 * @returns {Object} Scaled calculation for full batch
 */
function calculateFromBenchTrial(data) {
    const { trialVolume, bentoniteUsed, targetVolume } = data;

    // Convert trial volume from mL to L
    const trialVolumeL = trialVolume / 1000;

    // Calculate dosage rate in g/hL from trial
    const dosageRate = (bentoniteUsed / trialVolumeL) * 100;

    // Calculate for full batch
    return calculate_bentonite({
        volume: targetVolume,
        dosage: dosageRate
    });
}

/**
 * Bentonite hydration instructions
 */
const BENTONITE_HYDRATION_STEPS = [
    'Add bentonite powder slowly to cold water while stirring vigorously',
    'Mix thoroughly to avoid lumps - use a blender for best results',
    'Let slurry hydrate for at least 24 hours, stirring occasionally',
    'Add hydrated slurry to wine while stirring gently but thoroughly',
    'Allow wine to settle for 5-10 days before racking',
    'Check protein stability with heat test before bottling'
];

/**
 * Bentonite types and characteristics
 */
const BENTONITE_TYPES = {
    sodium: {
        name: 'Sodium bentonite',
        swelling: 'High swelling capacity',
        usage: 'Most common in winemaking',
        dosage: '20-80 g/hL'
    },
    calcium: {
        name: 'Calcium bentonite',
        swelling: 'Lower swelling capacity',
        usage: 'Less commonly used',
        dosage: '50-150 g/hL'
    }
};

// Export functions
window.calculate_bentonite = calculate_bentonite;
window.BentoniteCalculator = {
    calculate: calculate_bentonite,
    calculateFromBenchTrial: calculateFromBenchTrial,
    HYDRATION_STEPS: BENTONITE_HYDRATION_STEPS,
    TYPES: BENTONITE_TYPES
};
