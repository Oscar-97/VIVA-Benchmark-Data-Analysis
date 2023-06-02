import { CalculateDirection, CalculatePrimalBound, CalculateDualBound, CalculateGap, CalculateDifference, CalculateGapPercentage } from '../Src/Scripts/DataProcessing/CalculateResults';

jest.doMock('../Src/Scripts/DataProcessing/GetInstanceInformation', () => ({
    DOMElement: jest.fn(),
  }));

describe('CalculateDirection', () => {
    it('should return "max" when Direction is 1 or "1"', () => {
        const testCases = [1, '1'];
        testCases.forEach(testCase => {
            expect(CalculateDirection(testCase)).toBe('max');
        });
    });

    it('should return "min" when Direction is any other number or numeric string', () => {
        const testCases = [-1, '-1', 0, '0'];
        testCases.forEach(testCase => {
            expect(CalculateDirection(testCase)).toBe('min');
        });
    });
});

describe('CalculatePrimalBound', () => {
    it('should return -Infinity when PrimalBound is "", "NA", "nan", "-nan" and Direction is "max"', () => {
        const testCases = ['', 'NA', 'nan', '-nan'];
        testCases.forEach(testCase => {
            expect(CalculatePrimalBound(testCase, 'max')).toBe(-Infinity);
        });
    });

    it('should return Infinity when PrimalBound is "", "NA", "nan", "-nan" and Direction is "min"', () => {
        const testCases = ['', 'NA', 'nan', '-nan'];
        testCases.forEach(testCase => {
            expect(CalculatePrimalBound(testCase, 'min')).toBe(Infinity);
        });
    });

    it('should return Infinity when PrimalBound is "inf" or "+inf" regardless of Direction', () => {
        const testCases = ['inf', '+inf'];
        testCases.forEach(testCase => {
            expect(CalculatePrimalBound(testCase, 'max')).toBe(Infinity);
            expect(CalculatePrimalBound(testCase, 'min')).toBe(Infinity);
        });
    });

    it('should return -Infinity when PrimalBound is "-inf" regardless of Direction', () => {
        expect(CalculatePrimalBound('-inf', 'max')).toBe(-Infinity);
        expect(CalculatePrimalBound('-inf', 'min')).toBe(-Infinity);
    });

    it('should return a number when PrimalBound is a numeric string', () => {
        expect(CalculatePrimalBound('123', 'max')).toBe(123);
        expect(CalculatePrimalBound('123', 'min')).toBe(123);
    });

    it('should return the same number when PrimalBound is a number', () => {
        expect(CalculatePrimalBound(123, 'max')).toBe(123);
        expect(CalculatePrimalBound(123, 'min')).toBe(123);
    });
});

describe('CalculateDualBound', () => {
    it('should return Infinity when DualBound is "", "NA", "nan", "-nan" and Direction is "max"', () => {
        const testCases = ['', 'NA', 'nan', '-nan'];
        testCases.forEach(testCase => {
            expect(CalculateDualBound(testCase, 'max')).toBe(Infinity);
        });
    });

    it('should return -Infinity when DualBound is "", "NA", "nan", "-nan" and Direction is "min"', () => {
        const testCases = ['', 'NA', 'nan', '-nan'];
        testCases.forEach(testCase => {
            expect(CalculateDualBound(testCase, 'min')).toBe(-Infinity);
        });
    });

    it('should return Infinity when DualBound is "inf" or "+inf" regardless of Direction', () => {
        const testCases = ['inf', '+inf'];
        testCases.forEach(testCase => {
            expect(CalculateDualBound(testCase, 'max')).toBe(Infinity);
            expect(CalculateDualBound(testCase, 'min')).toBe(Infinity);
        });
    });

    it('should return -Infinity when DualBound is "-inf" regardless of Direction', () => {
        expect(CalculateDualBound('-inf', 'max')).toBe(-Infinity);
        expect(CalculateDualBound('-inf', 'min')).toBe(-Infinity);
    });

    it('should return a number when DualBound is a numeric string', () => {
        expect(CalculateDualBound('123', 'max')).toBe(123);
        expect(CalculateDualBound('123', 'min')).toBe(123);
    });

    it('should return the same number when DualBound is a number', () => {
        expect(CalculateDualBound(123, 'max')).toBe(123);
        expect(CalculateDualBound(123, 'min')).toBe(123);
    });
});

describe('CalculateGap', () => {
    it('should return 0.0 when a and b are equal within tolerance', () => {
        expect(CalculateGap(1, 1, 'max')).toBe(0.0);
        expect(CalculateGap(1, 1, 'min')).toBe(0.0);
        expect(CalculateGap(1, 1.000000001, 'max')).toBe(0.0);
        expect(CalculateGap(1, 1.000000001, 'min')).toBe(0.0);
    });

    it('should return Infinity when the minimum absolute value of a and b is less than tolerance', () => {
        expect(CalculateGap(0, 1, 'max')).toBe(Infinity);
        expect(CalculateGap(0, 1, 'min')).toBe(Infinity);
        expect(CalculateGap(1, 0, 'max')).toBe(Infinity);
        expect(CalculateGap(1, 0, 'min')).toBe(Infinity);
    });

    it('should return Infinity when either a or b is Infinity', () => {
        expect(CalculateGap(Infinity, 1, 'max')).toBe(Infinity);
        expect(CalculateGap(Infinity, 1, 'min')).toBe(Infinity);
        expect(CalculateGap(1, Infinity, 'max')).toBe(Infinity);
        expect(CalculateGap(1, Infinity, 'min')).toBe(Infinity);
    });

    it('should return Infinity when a and b have different signs', () => {
        expect(CalculateGap(-1, 1, 'max')).toBe(Infinity);
        expect(CalculateGap(-1, 1, 'min')).toBe(Infinity);
        expect(CalculateGap(1, -1, 'max')).toBe(Infinity);
        expect(CalculateGap(1, -1, 'min')).toBe(Infinity);
    });

    it('should return the gap between a and b when none of the above conditions are met', () => {
        expect(CalculateGap(1, 2, 'max')).toBeCloseTo(-1.0, 7);
        expect(CalculateGap(1, 2, 'min')).toBeCloseTo(1.0, 7);
        expect(CalculateGap(2, 1, 'max')).toBeCloseTo(1.0, 7);
        expect(CalculateGap(2, 1, 'min')).toBeCloseTo(-1.0, 7);
    });
});

describe('CalculateDifference', () => {
    it('should return the difference between a and b', () => {
        expect(CalculateDifference(1, 2)).toBeCloseTo(1.0, 7);
        expect(CalculateDifference(2, 1)).toBeCloseTo(1.0, 7);
        expect(CalculateDifference(-1, 1)).toBeCloseTo(2.0, 7);
        expect(CalculateDifference(1, -1)).toBeCloseTo(2.0, 7);
        expect(CalculateDifference(-1, -2)).toBeCloseTo(1.0, 7);
        expect(CalculateDifference(-2, -1)).toBeCloseTo(1.0, 7);
    });

    it('should return 0 when a and b are equal', () => {
        expect(CalculateDifference(1, 1)).toBe(0);
        expect(CalculateDifference(-1, -1)).toBe(0);
    });
});

describe('CalculateGapPercentage', () => {
    it('should return 0.0 when a and b are both Infinity', () => {
        expect(CalculateGapPercentage(Infinity, Infinity, 'max')).toBe(0.0);
        expect(CalculateGapPercentage(Infinity, Infinity, 'min')).toBe(0.0);
    });

    it('should return a - b * 100 when either a or b is Infinity but not both', () => {
        expect(CalculateGapPercentage(Infinity, 1, 'max')).toBeCloseTo(Infinity, 7);
        expect(CalculateGapPercentage(Infinity, 1, 'min')).toBeCloseTo(-Infinity, 7);
        expect(CalculateGapPercentage(1, Infinity, 'max')).toBeCloseTo(-Infinity, 7);
        expect(CalculateGapPercentage(1, Infinity, 'min')).toBeCloseTo(Infinity, 7);
    });

    it('should return the percentage gap between a and b when neither a nor b is Infinity', () => {
        expect(CalculateGapPercentage(1, 2, 'max')).toBeCloseTo(-100.0, 7);
        expect(CalculateGapPercentage(1, 2, 'min')).toBeCloseTo(100.0, 7);
        expect(CalculateGapPercentage(2, 1, 'max')).toBeCloseTo(100.0, 7);
        expect(CalculateGapPercentage(2, 1, 'min')).toBeCloseTo(-100.0, 7);
    });
});