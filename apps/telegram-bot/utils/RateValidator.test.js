import { describe, test, expect } from '@jest/globals';
import fc from 'fast-check';
import RateValidator from './RateValidator.js';

describe('RateValidator', () => {
  /**
   * Property 1: Rate input validation
   * For any rate input string, the validation function should correctly identify 
   * valid formats (numeric with optional currency symbols and "/hr" suffix) and 
   * reject invalid formats with appropriate error messages
   * **Feature: tuition-rate-application, Property 1: Rate input validation**
   * **Validates: Requirements 2.1, 2.4, 2.5**
   */
  test('Property 1: Rate input validation', () => {
    fc.assert(fc.property(
      fc.oneof(
        // Valid formats
        fc.record({
          type: fc.constant('valid'),
          value: fc.oneof(
            // Plain numbers (ensure minimum 0.1 to avoid zero/near-zero issues)
            fc.float({ min: Math.fround(0.1), max: Math.fround(999.99) })
              .filter(n => isFinite(n) && n > 0)
              .map(n => n.toFixed(2)),
            fc.float({ min: Math.fround(1), max: Math.fround(999) })
              .filter(n => isFinite(n) && n > 0)
              .map(n => Math.floor(n).toString()),
            // With dollar sign
            fc.float({ min: Math.fround(0.1), max: Math.fround(999.99) })
              .filter(n => isFinite(n) && n > 0)
              .map(n => `$${n.toFixed(2)}`),
            fc.float({ min: Math.fround(1), max: Math.fround(999) })
              .filter(n => isFinite(n) && n > 0)
              .map(n => `$${Math.floor(n)}`),
            // With /hr suffix (case variations)
            fc.float({ min: Math.fround(1), max: Math.fround(999) })
              .filter(n => isFinite(n) && n > 0)
              .map(n => `${Math.floor(n)}/hr`),
            fc.float({ min: Math.fround(1), max: Math.fround(999) })
              .filter(n => isFinite(n) && n > 0)
              .map(n => `${Math.floor(n)}/Hr`),
            fc.float({ min: Math.fround(1), max: Math.fround(999) })
              .filter(n => isFinite(n) && n > 0)
              .map(n => `${Math.floor(n)}/HR`),
            // With both dollar and /hr
            fc.float({ min: Math.fround(1), max: Math.fround(999) })
              .filter(n => isFinite(n) && n > 0)
              .map(n => `$${Math.floor(n)}/hr`),
            fc.float({ min: Math.fround(0.1), max: Math.fround(999.99) })
              .filter(n => isFinite(n) && n > 0)
              .map(n => `$${n.toFixed(2)}/hr`)
          )
        }),
        // Invalid formats
        fc.record({
          type: fc.constant('invalid'),
          value: fc.oneof(
            // Non-numeric strings
            fc.string().filter(s => !/^[\$]?(\d+(?:\.\d{1,2})?)(?:\/hr)?$/i.test(s.trim())),
            // Empty or whitespace
            fc.constant(''),
            fc.constant('   '),
            // Invalid characters
            fc.constant('abc'),
            fc.constant('30abc'),
            fc.constant('$30abc/hr'),
            fc.constant('30//hr'),
            fc.constant('$$30'),
            // Negative numbers and zero
            fc.constant('-30'),
            fc.constant('$-30/hr'),
            fc.constant('0'),
            fc.constant('$0'),
            fc.constant('$0/hr')
          )
        })
      ),
      (testCase) => {
        const result = RateValidator.validate(testCase.value);
        
        if (testCase.type === 'valid') {
          // Valid inputs should pass validation
          expect(result.valid).toBe(true);
          expect(result.error).toBeUndefined();
          expect(result.rate).toBeDefined();
          expect(result.formatted).toBeDefined();
          expect(result.formatted).toMatch(/^\$\d+(?:\.\d{1,2})?\/hr$/);
          
          // Rate should be a valid number string
          const rateNum = parseFloat(result.rate);
          expect(rateNum).toBeGreaterThan(0);
          expect(isFinite(rateNum)).toBe(true);
        } else {
          // Invalid inputs should fail validation
          expect(result.valid).toBe(false);
          expect(result.error).toBeDefined();
          expect(typeof result.error).toBe('string');
          expect(result.error.length).toBeGreaterThan(0);
        }
      }
    ), { numRuns: 100 });
  });

  /**
   * Property 2: Rate range warnings
   * For any valid rate input, rates below $10 or above $200 should generate 
   * warnings but still be accepted
   * **Feature: tuition-rate-application, Property 2: Rate range warnings**
   * **Validates: Requirements 2.2, 2.3**
   */
  test('Property 2: Rate range warnings', () => {
    fc.assert(fc.property(
      fc.oneof(
        // Low rates (below 10, using integers and converting to avoid float precision issues)
        fc.record({
          range: fc.constant('low'),
          rate: fc.integer({ min: 10, max: 999 }).map(n => n / 100) // 0.10 to 9.99
        }),
        // Normal rates (10-200)
        fc.record({
          range: fc.constant('normal'),
          rate: fc.integer({ min: 1000, max: 20000 }).map(n => n / 100) // 10.00 to 200.00
        }),
        // High rates (above 200)
        fc.record({
          range: fc.constant('high'),
          rate: fc.integer({ min: 20001, max: 99999 }).map(n => n / 100) // 200.01 to 999.99
        })
      ),
      (testCase) => {
        // Format to 2 decimal places to avoid precision issues
        const input = testCase.rate.toFixed(2);
        const result = RateValidator.validate(input);
        
        // All should be valid
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
        
        if (testCase.range === 'low') {
          // Low rates should have warning
          expect(result.warning).toBeDefined();
          expect(result.warning).toContain('low');
        } else if (testCase.range === 'high') {
          // High rates should have warning
          expect(result.warning).toBeDefined();
          expect(result.warning).toContain('high');
        } else {
          // Normal rates should not have warning
          expect(result.warning).toBeNull();
        }
      }
    ), { numRuns: 100 });
  });

  // Unit tests for specific examples and edge cases
  describe('Unit tests for specific examples', () => {
    test('should validate common input formats', () => {
      const validInputs = [
        { input: '30', expected: { valid: true, rate: '30', formatted: '$30/hr' } },
        { input: '$30', expected: { valid: true, rate: '30', formatted: '$30/hr' } },
        { input: '30/hr', expected: { valid: true, rate: '30', formatted: '$30/hr' } },
        { input: '$30/hr', expected: { valid: true, rate: '30', formatted: '$30/hr' } },
        { input: '30/Hr', expected: { valid: true, rate: '30', formatted: '$30/hr' } },
        { input: '$30/HR', expected: { valid: true, rate: '30', formatted: '$30/hr' } },
        { input: '30.50', expected: { valid: true, rate: '30.5', formatted: '$30.5/hr' } },
        { input: '$30.50/hr', expected: { valid: true, rate: '30.5', formatted: '$30.5/hr' } }
      ];

      validInputs.forEach(({ input, expected }) => {
        const result = RateValidator.validate(input);
        expect(result.valid).toBe(expected.valid);
        expect(result.rate).toBe(expected.rate);
        expect(result.formatted).toBe(expected.formatted);
      });
    });

    test('should reject invalid formats', () => {
      const invalidInputs = [
        '',
        '   ',
        'abc',
        '30abc',
        '$30abc/hr',
        '30//hr',
        '$$30',
        '-30',
        '$-30/hr',
        null,
        undefined
      ];

      invalidInputs.forEach(input => {
        const result = RateValidator.validate(input);
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    test('should provide appropriate warnings for range', () => {
      // Low rate warning
      const lowResult = RateValidator.validate('5');
      expect(lowResult.valid).toBe(true);
      expect(lowResult.warning).toContain('low');

      // High rate warning
      const highResult = RateValidator.validate('250');
      expect(highResult.valid).toBe(true);
      expect(highResult.warning).toContain('high');

      // Normal rate no warning
      const normalResult = RateValidator.validate('50');
      expect(normalResult.valid).toBe(true);
      expect(normalResult.warning).toBeNull();
    });
  });
});