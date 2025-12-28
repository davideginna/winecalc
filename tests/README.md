# WineCalc Test Suite

Automated tests for all calculator functions.

## Setup

```bash
npm install
```

## Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## What is Tested

### 1. Function Existence
- All 10 calculator functions are properly exported to `window` object
- Naming convention is correct (camelCase)

### 2. Input Validation
Each calculator is tested for proper error handling:
- Empty/null values
- NaN (Not a Number) values
- Negative values
- Zero values where not allowed

### 3. Calculation Accuracy
Each calculator is tested with known inputs to verify:
- Correct mathematical formulas
- Proper rounding
- Correct units conversion

### 4. Output Format
Verifies that results contain expected fields with correct data types.

## Test Coverage

Target: 100% coverage of all calculator functions in `js/calculators/`

Current coverage can be viewed by running:
```bash
npm run test:coverage
```

## Adding Tests for New Calculators

When adding a new calculator:

1. Add function existence test:
```javascript
test('calculateNewCalc exists', () => {
    expect(typeof window.calculateNewCalc).toBe('function');
});
```

2. Add validation tests:
```javascript
describe('New Calculator', () => {
    test('throws error on empty inputs', () => {
        expect(() => window.calculateNewCalc({})).toThrow();
    });
});
```

3. Add calculation tests with known values:
```javascript
test('calculates correctly', () => {
    const result = window.calculateNewCalc({ input: 100 });
    expect(result.output).toBe(expectedValue);
});
```

## Continuous Integration

These tests can be integrated into CI/CD pipelines (GitHub Actions, GitLab CI, etc.) to automatically verify code changes before deployment.
