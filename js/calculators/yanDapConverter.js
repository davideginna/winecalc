/**
 * YAN/DAP Converter
 *
 * Converts between YAN (Yeast Assimilable Nitrogen) and DAP (Diammonium Phosphate).
 *
 * Formula:
 * DAP (mg/L) = YAN (mg/L) × 4.7
 * YAN (mg/L) = DAP (mg/L) / 4.7
 *
 * Where 4.7 mg/L DAP ≈ 1 mg/L YAN
 */

function calculateYanDapConverter(data) {
    const { yanAmount, dapAmount } = data;

    const YAN_TO_DAP_RATIO = 4.7;

    // If both values provided, YAN to DAP conversion takes precedence
    if (yanAmount !== undefined && yanAmount !== null && yanAmount !== '') {
        const yan = parseFloat(yanAmount);
        if (isNaN(yan) || yan < 0) {
            throw new Error(window.WineCalcI18n.t('errors.invalidInput'));
        }

        // Convert YAN to DAP
        const convertedDap = yan * YAN_TO_DAP_RATIO;

        return {
            yanResult: Math.round(yan * 100) / 100,
            dapResult: Math.round(convertedDap * 100) / 100
        };
    }

    // If only DAP provided, convert to YAN
    if (dapAmount !== undefined && dapAmount !== null && dapAmount !== '') {
        const dap = parseFloat(dapAmount);
        if (isNaN(dap) || dap < 0) {
            throw new Error(window.WineCalcI18n.t('errors.invalidInput'));
        }

        // Convert DAP to YAN
        const convertedYan = dap / YAN_TO_DAP_RATIO;

        return {
            yanResult: Math.round(convertedYan * 100) / 100,
            dapResult: Math.round(dap * 100) / 100
        };
    }

    // If neither value provided
    throw new Error(window.WineCalcI18n.t('errors.invalidInput'));
}

// Export function
window.calculateYanDapConverter = calculateYanDapConverter;
