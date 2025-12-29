/**
 * WineCalc - Calculators Test Suite
 *
 * Tests all calculator functions for:
 * - Function existence and exports
 * - Input validation (empty, NaN, negative values)
 * - Correct calculations with known values
 * - Output format
 */

// Mock WineCalcI18n
global.WineCalcI18n = {
    t: (key) => {
        const translations = {
            'errors.volumeRequired': 'Volume is required',
            'errors.positiveValue': 'Value must be positive',
            'errors.invalidInput': 'Please enter at least one valid value',
            'errors.invalidVolume': 'Volume must be greater than zero'
        };
        return translations[key] || key;
    }
};

// Load all calculator files
require('../js/calculators/acid.js');
require('../js/calculators/ascorbicAcid.js');
require('../js/calculators/bentonite.js');
require('../js/calculators/carbon.js');
require('../js/calculators/copperSulfateLarge.js');
require('../js/calculators/copperSulfateSmall.js');
require('../js/calculators/cremeOfTartar.js');
require('../js/calculators/dapPreFermentation.js');
require('../js/calculators/dapAddition.js');
require('../js/calculators/yanDapConverter.js');
require('../js/calculators/pms.js');

describe('Calculator Functions Exist', () => {
    test('calculateAcid exists', () => {
        expect(typeof window.calculateAcid).toBe('function');
    });

    test('calculateAscorbicAcid exists', () => {
        expect(typeof window.calculateAscorbicAcid).toBe('function');
    });

    test('calculateBentonite exists', () => {
        expect(typeof window.calculateBentonite).toBe('function');
    });

    test('calculateCarbon exists', () => {
        expect(typeof window.calculateCarbon).toBe('function');
    });

    test('calculateCopperSulfateLarge exists', () => {
        expect(typeof window.calculateCopperSulfateLarge).toBe('function');
    });

    test('calculateCopperSulfateSmall exists', () => {
        expect(typeof window.calculateCopperSulfateSmall).toBe('function');
    });

    test('calculateCremeOfTartar exists', () => {
        expect(typeof window.calculateCremeOfTartar).toBe('function');
    });

    test('calculateDapPreFermentation exists', () => {
        expect(typeof window.calculateDapPreFermentation).toBe('function');
    });

    test('calculateDapAddition exists', () => {
        expect(typeof window.calculateDapAddition).toBe('function');
    });

    test('calculateYanDapConverter exists', () => {
        expect(typeof window.calculateYanDapConverter).toBe('function');
    });

    test('calculatePms exists', () => {
        expect(typeof window.calculatePms).toBe('function');
    });
});

describe('Acid Addition Calculator', () => {
    const calc = () => window.calculateAcid;

    test('throws error on empty volume', () => {
        expect(() => calc()({ additionRate: 5, volume: null })).toThrow('Volume is required');
    });

    test('throws error on NaN volume', () => {
        expect(() => calc()({ additionRate: 5, volume: NaN })).toThrow('Volume is required');
    });

    test('throws error on negative volume', () => {
        expect(() => calc()({ additionRate: 5, volume: -10 })).toThrow('Volume is required');
    });

    test('throws error on empty additionRate', () => {
        expect(() => calc()({ additionRate: null, volume: 100 })).toThrow('Value must be positive');
    });

    test('calculates correctly with valid inputs', () => {
        const result = calc()({ additionRate: 2, volume: 100 });
        expect(result.amountKg).toBe(0.2); // (2 * 100) / 1000 = 0.2
        expect(result.amountG).toBe(200); // 2 * 100 = 200
    });
});

describe('Ascorbic Acid Calculator', () => {
    const calc = () => window.calculateAscorbicAcid;

    test('throws error on empty inputs', () => {
        expect(() => calc()({ additionRate: null, volume: null })).toThrow();
    });

    test('calculates correctly with valid inputs', () => {
        const result = calc()({ additionRate: 50, volume: 100 });
        expect(result.amountG).toBe(5); // (100 * 50) / 1000 = 5
        expect(result.amountKg).toBe(0.005); // 5 / 1000 = 0.005
        expect(result.amountMg).toBe(5000); // 100 * 50 = 5000
    });
});

describe('Bentonite Calculator', () => {
    const calc = () => window.calculateBentonite;

    test('throws error on missing concentration', () => {
        expect(() => calc()({ additionRate: 1, volume: 100, concentration: null })).toThrow();
    });

    test('calculates correctly with valid inputs', () => {
        const result = calc()({ additionRate: 1, volume: 100, concentration: 5 });
        // Total bentonite: 1 * 100 = 100g
        // Solution volume: 100 / (5 * 10) = 2L
        expect(result.solutionVolume).toBe(2);
    });
});

describe('Carbon Calculator', () => {
    const calc = () => window.calculateCarbon;

    test('throws error on NaN carbonAmount', () => {
        expect(() => calc()({ carbonAmount: NaN, volume: 100 })).toThrow();
    });

    test('calculates correctly with valid inputs', () => {
        const result = calc()({ carbonAmount: 500, volume: 100 });
        expect(result.amountG).toBe(50); // (500 * 100) / 1000 = 50
    });
});

describe('Copper Sulfate Large Volume Calculator', () => {
    const calc = () => window.calculateCopperSulfateLarge;

    test('throws error on zero volume', () => {
        expect(() => calc()({ copperRate: 0.5, volume: 0 })).toThrow();
    });

    test('calculates correctly with valid inputs', () => {
        const result = calc()({ copperRate: 0.5, volume: 1000 });
        // (0.5 * 1000) / (1000 * 0.2545) = 1.96
        expect(result.copperSulfateG).toBeCloseTo(1.96, 1);
    });
});

describe('Copper Sulfate Small Volume Calculator', () => {
    const calc = () => window.calculateCopperSulfateSmall;

    test('throws error on missing stockConcentration', () => {
        expect(() => calc()({
            copperRate: 0.5,
            volume: 100,
            volumeUnit: 'mL',
            stockConcentration: null,
            stockUnit: '%'
        })).toThrow();
    });

    test('calculates correctly with mL volume and % concentration', () => {
        const result = calc()({
            copperRate: 0.5,
            volume: 100,
            volumeUnit: 'mL',
            stockConcentration: 5,
            stockUnit: '%'
        });
        expect(result.solutionVolumeMl).toBeGreaterThan(0);
        expect(result.solutionVolumeUl).toBeGreaterThan(0);
    });
});

describe('Crème of Tartar Calculator', () => {
    const calc = () => window.calculateCremeOfTartar;

    test('throws error on negative additionRate', () => {
        expect(() => calc()({ additionRate: -100, volume: 100 })).toThrow();
    });

    test('calculates correctly with valid inputs', () => {
        const result = calc()({ additionRate: 500, volume: 1000 });
        // (500 * 1000) / 1000000 = 0.5
        expect(result.amountKg).toBe(0.5);
    });
});

describe('DAP Pre-Fermentation Calculator', () => {
    const calc = () => window.calculateDapPreFermentation;

    test('throws error on NaN initialYan', () => {
        expect(() => calc()({ initialYan: NaN, requiredYan: 200, volume: 100 })).toThrow();
    });

    test('returns zero when initial YAN is higher than required', () => {
        const result = calc()({ initialYan: 250, requiredYan: 200, volume: 100 });
        expect(result.dapAmount).toBe(0);
    });

    test('calculates correctly with valid inputs', () => {
        const result = calc()({ initialYan: 100, requiredYan: 200, volume: 100 });
        // YAN difference: 200 - 100 = 100
        // DAP amount: (100 * 100 * 4.7) / 1000 = 47
        expect(result.dapAmount).toBe(47);
    });
});

describe('DAP Addition Calculator', () => {
    const calc = () => window.calculateDapAddition;

    test('throws error on empty dapRequired', () => {
        expect(() => calc()({ dapRequired: null, volume: 100 })).toThrow();
    });

    test('calculates correctly with valid inputs', () => {
        const result = calc()({ dapRequired: 250, volume: 100 });
        // (250 * 100) / 1000 = 25
        expect(result.dapAmount).toBe(25);
    });
});

describe('YAN/DAP Converter', () => {
    const calc = () => window.calculateYanDapConverter;

    test('throws error when both inputs are empty', () => {
        expect(() => calc()({ yanAmount: null, dapAmount: null })).toThrow();
    });

    test('converts YAN to DAP correctly', () => {
        const result = calc()({ yanAmount: 100, dapAmount: null });
        expect(result.yanResult).toBe(100);
        expect(result.dapResult).toBe(470); // 100 * 4.7 = 470
    });

    test('converts DAP to YAN correctly', () => {
        const result = calc()({ yanAmount: null, dapAmount: 470 });
        expect(result.dapResult).toBe(470);
        expect(result.yanResult).toBe(100); // 470 / 4.7 = 100
    });

    test('YAN takes precedence when both are provided', () => {
        const result = calc()({ yanAmount: 100, dapAmount: 500 });
        expect(result.yanResult).toBe(100);
        expect(result.dapResult).toBe(470); // Converted from YAN, not using 500
    });
});

describe('PMS (Potassium Metabisulphite) Calculator', () => {
    const calc = () => window.calculatePms;

    test('throws error on empty volume', () => {
        expect(() => calc()({ so2Rate: 30, volume: null })).toThrow('Volume is required');
    });

    test('throws error on NaN volume', () => {
        expect(() => calc()({ so2Rate: 30, volume: NaN })).toThrow('Volume is required');
    });

    test('throws error on negative volume', () => {
        expect(() => calc()({ so2Rate: 30, volume: -10 })).toThrow('Volume is required');
    });

    test('throws error on empty so2Rate', () => {
        expect(() => calc()({ so2Rate: null, volume: 100 })).toThrow('Value must be positive');
    });

    test('throws error on NaN so2Rate', () => {
        expect(() => calc()({ so2Rate: NaN, volume: 100 })).toThrow('Value must be positive');
    });

    test('throws error on negative so2Rate', () => {
        expect(() => calc()({ so2Rate: -5, volume: 100 })).toThrow('Value must be positive');
    });

    test('calculates correctly with valid inputs', () => {
        const result = calc()({ so2Rate: 30, volume: 100 });
        // PMS (g) = (30 * 100) / 570 = 5.26
        expect(result.pmsGrams).toBeCloseTo(5.26, 2);
    });

    test('calculates correctly with larger volume', () => {
        const result = calc()({ so2Rate: 50, volume: 1000 });
        // PMS (g) = (50 * 1000) / 570 = 87.72
        expect(result.pmsGrams).toBeCloseTo(87.72, 2);
    });

    test('calculates correctly with small values', () => {
        const result = calc()({ so2Rate: 20, volume: 10 });
        // PMS (g) = (20 * 10) / 570 = 0.35
        expect(result.pmsGrams).toBeCloseTo(0.35, 2);
    });

    test('returns correct number of decimals (2)', () => {
        const result = calc()({ so2Rate: 30, volume: 100 });
        const decimals = result.pmsGrams.toString().split('.')[1]?.length || 0;
        expect(decimals).toBeLessThanOrEqual(2);
    });
});

describe('Input Validation - All Calculators', () => {
    test('all calculators reject empty objects', () => {
        expect(() => window.calculateAcid({})).toThrow();
        expect(() => window.calculateAscorbicAcid({})).toThrow();
        expect(() => window.calculateBentonite({})).toThrow();
        expect(() => window.calculateCarbon({})).toThrow();
        expect(() => window.calculateCopperSulfateLarge({})).toThrow();
        expect(() => window.calculateCopperSulfateSmall({})).toThrow();
        expect(() => window.calculateCremeOfTartar({})).toThrow();
        expect(() => window.calculateDapPreFermentation({})).toThrow();
        expect(() => window.calculateDapAddition({})).toThrow();
        expect(() => window.calculateYanDapConverter({})).toThrow();
        expect(() => window.calculatePms({})).toThrow();
    });
});
