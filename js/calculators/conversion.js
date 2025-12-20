/* WineCalc - Unit Conversion Calculator */

/**
 * Conversion factors for various units
 */
const CONVERSION_FACTORS = {
    // Volume conversions (to liters)
    volume: {
        liters: 1,
        milliliters: 0.001,
        hectoliters: 100,
        gallons_us: 3.78541,
        gallons_uk: 4.54609,
        barrels: 119.24,
        bottles_750ml: 0.75,
        magnums: 1.5
    },

    // Weight conversions (to grams)
    weight: {
        grams: 1,
        kilograms: 1000,
        milligrams: 0.001,
        pounds: 453.592,
        ounces: 28.3495
    },

    // Temperature conversions
    temperature: {
        celsius: { offset: 0, factor: 1 },
        fahrenheit: { offset: 32, factor: 9/5 },
        kelvin: { offset: 273.15, factor: 1 }
    },

    // Density/Sugar conversions
    density: {
        brix: 1,           // Reference
        baume: 1.8,        // Approximate: Brix ≈ 1.8 × Baumé
        sg: 1000,          // Specific gravity (offset needed)
        plato: 1           // Plato ≈ Brix for practical purposes
    },

    // Alcohol conversions
    alcohol: {
        abv: 1,            // Alcohol by volume %
        proof_us: 2,       // US proof = 2 × ABV
        proof_uk: 1.75     // UK proof ≈ 1.75 × ABV
    }
};

/**
 * General unit conversion calculator
 *
 * @param {Object} data - Input data
 * @param {number} data.value - Value to convert
 * @param {string} data.category - Category (volume, weight, temperature, density, alcohol)
 * @param {string} data.fromUnit - Source unit
 * @param {string} data.toUnit - Target unit
 * @returns {Object} Conversion result
 */
function calculate_conversion(data) {
    const { value, category, fromUnit, toUnit } = data;

    if (!value || isNaN(value)) {
        throw new Error('Invalid value');
    }

    let result;

    switch (category) {
        case 'temperature':
            result = convertTemperature(value, fromUnit, toUnit);
            break;
        case 'density':
            result = convertDensity(value, fromUnit, toUnit);
            break;
        default:
            result = convertLinear(value, category, fromUnit, toUnit);
    }

    return {
        converted: Math.round(result * 100000) / 100000,
        originalValue: value,
        originalUnit: fromUnit,
        targetUnit: toUnit,
        category: category
    };
}

/**
 * Convert linear units (volume, weight, alcohol)
 */
function convertLinear(value, category, fromUnit, toUnit) {
    const factors = CONVERSION_FACTORS[category];

    if (!factors || !factors[fromUnit] || !factors[toUnit]) {
        throw new Error(`Unknown unit in category ${category}`);
    }

    // Convert to base unit, then to target unit
    const baseValue = value * factors[fromUnit];
    return baseValue / factors[toUnit];
}

/**
 * Convert temperature
 */
function convertTemperature(value, fromUnit, toUnit) {
    // First convert to Celsius
    let celsius;

    switch (fromUnit) {
        case 'celsius':
            celsius = value;
            break;
        case 'fahrenheit':
            celsius = (value - 32) * 5/9;
            break;
        case 'kelvin':
            celsius = value - 273.15;
            break;
        default:
            throw new Error('Unknown temperature unit');
    }

    // Then convert from Celsius to target
    switch (toUnit) {
        case 'celsius':
            return celsius;
        case 'fahrenheit':
            return (celsius * 9/5) + 32;
        case 'kelvin':
            return celsius + 273.15;
        default:
            throw new Error('Unknown temperature unit');
    }
}

/**
 * Convert density/sugar units
 */
function convertDensity(value, fromUnit, toUnit) {
    // Special handling for SG (Specific Gravity)

    // First convert to Brix
    let brix;

    switch (fromUnit) {
        case 'brix':
        case 'plato':
            brix = value;
            break;
        case 'baume':
            brix = value * 1.8;
            break;
        case 'sg':
            // SG to Brix: Brix ≈ (SG - 1) × 1000 / 4
            // More accurate: Brix ≈ 182.4601 × (SG - 1) - 142.1868 × (SG - 1)² + 500.5255 × (SG - 1)³
            const sg = value;
            const delta = sg - 1;
            brix = 182.4601 * delta + 142.1868 * delta * delta + 500.5255 * delta * delta * delta;
            break;
        default:
            throw new Error('Unknown density unit');
    }

    // Then convert from Brix to target
    switch (toUnit) {
        case 'brix':
        case 'plato':
            return brix;
        case 'baume':
            return brix / 1.8;
        case 'sg':
            // Brix to SG: SG ≈ 1 + (Brix / 258.6) - ((Brix / 258.6)² × 0.00898)
            return 1 + (brix / 258.6) - ((brix / 258.6) ** 2 * 0.00898);
        default:
            throw new Error('Unknown density unit');
    }
}

/**
 * Convert Brix to potential alcohol
 */
function brixToAlcohol(brix) {
    // Rule of thumb: Brix × 0.55 ≈ potential ABV
    // More accurate: Brix × 0.55 to 0.6 depending on fermentation efficiency
    return brix * 0.55;
}

/**
 * Convert specific gravity to potential alcohol
 */
function sgToAlcohol(sg) {
    // SG to alcohol: ABV ≈ (OG - FG) × 131.25
    // This assumes FG = 1.000 (dry fermentation)
    return (sg - 1) * 131.25;
}

/**
 * Convert alcohol by volume to alcohol by weight
 */
function abvToAbw(abv) {
    // ABW ≈ ABV × 0.789 (density of ethanol relative to water)
    return abv * 0.789;
}

/**
 * Calculate wine volume from bottle counts
 */
function bottlesToVolume(bottles, bottleSize = 750) {
    // bottleSize in mL
    return bottles * (bottleSize / 1000); // Returns liters
}

/**
 * Calculate bottle count from volume
 */
function volumeToBottles(liters, bottleSize = 750) {
    // bottleSize in mL
    return liters / (bottleSize / 1000);
}

/**
 * Convert dosage (g/hL to g/L, mg/L, etc.)
 */
function convertDosage(value, fromUnit, toUnit, volume = 1) {
    const dosageFactors = {
        'g/hl': 0.01,      // grams per hectoliter → g/L
        'g/l': 1,          // grams per liter
        'mg/l': 0.001,     // milligrams per liter → g/L
        'kg/hl': 10,       // kilograms per hectoliter → g/L
        'ppm': 0.001       // parts per million → g/L (for water-based)
    };

    const fromFactor = dosageFactors[fromUnit.toLowerCase()] || 1;
    const toFactor = dosageFactors[toUnit.toLowerCase()] || 1;

    const baseValue = value * fromFactor;
    return baseValue / toFactor;
}

/**
 * Quick conversion presets
 */
const QUICK_CONVERSIONS = {
    celsiusToFahrenheit: (c) => (c * 9/5) + 32,
    fahrenheitToCelsius: (f) => (f - 32) * 5/9,
    litersTوGallons: (l) => l / 3.78541,
    gallonsToLiters: (g) => g * 3.78541,
    brixToSG: (brix) => 1 + (brix / 258.6) - ((brix / 258.6) ** 2 * 0.00898),
    sgToBrix: (sg) => {
        const delta = sg - 1;
        return 182.4601 * delta + 142.1868 * delta * delta + 500.5255 * delta * delta * delta;
    },
    gramsToOunces: (g) => g / 28.3495,
    ouncesToGrams: (oz) => oz * 28.3495
};

// Export functions
window.calculate_conversion = calculate_conversion;
window.ConversionCalculator = {
    calculate: calculate_conversion,
    convertTemperature,
    convertDensity,
    brixToAlcohol,
    sgToAlcohol,
    abvToAbw,
    bottlesToVolume,
    volumeToBottles,
    convertDosage,
    QUICK_CONVERSIONS,
    CONVERSION_FACTORS
};
