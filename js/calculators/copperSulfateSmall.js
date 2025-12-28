/* WineCalc - Copper Sulfate Addition Calculator (Small Volume) */

/**
 * Calculate copper sulfate (CuSO4·5H2O) stock solution volume for small volumes
 * (bench trial, glass, or very small volume)
 *
 * Copper sulfate is used to remove hydrogen sulfide (H2S) and mercaptans from wine.
 * CuSO4·5H2O molecular weight: 249.68 g/mol
 * Cu atomic weight: 63.55 g/mol
 * Cu content in CuSO4·5H2O: 25.45%
 *
 * @param {Object} data - Input data
 * @param {number} data.copperRate - Desired addition rate of Cu2+ in mg/L
 * @param {number} data.volume - Volume of wine/juice
 * @param {string} data.volumeUnit - Unit of volume ("mL" or "L")
 * @param {number} data.stockConcentration - Stock concentration of CuSO4·5H2O
 * @param {string} data.stockUnit - Unit of stock concentration ("percent" or "gPerL")
 * @returns {Object} Calculation results
 */
function calculateCopperSulfateSmall(data) {
    const { copperRate, volume, volumeUnit, stockConcentration, stockUnit } = data;

    // Validation
    if (!copperRate || isNaN(copperRate) || copperRate <= 0) {
        throw new Error(WineCalcI18n.t('errors.positiveValue'));
    }

    if (!volume || isNaN(volume) || volume <= 0) {
        throw new Error(WineCalcI18n.t('errors.volumeRequired'));
    }

    if (!stockConcentration || isNaN(stockConcentration) || stockConcentration <= 0) {
        throw new Error(WineCalcI18n.t('errors.positiveValue'));
    }

    // Cu content in CuSO4·5H2O is 25.45%
    const CU_PERCENTAGE = 0.2545;

    // Convert volume to liters
    const volumeL = volumeUnit === 'mL' ? volume / 1000 : volume;

    // Calculate total Cu needed in mg
    const totalCuMg = copperRate * volumeL;

    // Calculate CuSO4·5H2O needed in mg
    const copperSulfateMg = totalCuMg / CU_PERCENTAGE;

    // Convert stock concentration to g/L
    // If stock is in %, convert: % × 10 = g/L (because % means g/100mL, so g/L = % × 10)
    const stockGPerL = stockUnit === 'percent' ? stockConcentration * 10 : stockConcentration;

    // Calculate volume of stock solution needed in mL
    // Volume (mL) = CuSO4·5H2O needed (mg) / Stock concentration (mg/mL)
    // Stock concentration (mg/mL) = Stock concentration (g/L)
    const solutionVolumeMl = copperSulfateMg / stockGPerL;

    // Convert to µL
    const solutionVolumeUl = solutionVolumeMl * 1000;

    return {
        solutionVolumeMl: Math.round(solutionVolumeMl * 100) / 100,  // mL (2 decimals)
        solutionVolumeUl: Math.round(solutionVolumeUl)                // µL (0 decimals)
    };
}

// Export function
window.calculateCopperSulfateSmall = calculateCopperSulfateSmall;
