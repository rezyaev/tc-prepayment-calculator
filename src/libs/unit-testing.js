/** @file Module for unit testing pure functions */

import { areEqual } from './equality.js';

// ANSI escape codes for terminal font colors
const greenCode = '\x1b[32m';
const redCode = '\x1b[31m';
const resetCode = '\x1b[0m';

/**
 * @typedef {object} TestData
 * @property {any} input - arguments for tested function
 * @property {any} output - expected result
 */

/**
 * Tests passed function with given test data and outputs result to console
 *
 * @example
 * const sum = (firstNumber, secondNumber) => firstNumber + secondNumber;
 *
 * test(sum, [
 *   {
 *     // If function takes several arguments, pass an array as input.
 *     // Otherwise, just pass a single value.
 *     input: [1, 3],
 *     output: 4
 *   },
 *   {
 *     input: [2, 2],
 *     output: 5
 *   }
 * ], { moduleName: 'Math' });
 *
 * // Console output:
 * // Math, sum #1: PASSED
 * // Math, sum #2: FAILED (expected '4' to equal '5')
 *
 * @param {(...args: any[]) => any} func
 * @param {TestData[]} tests
 * @param {object} [metadata]
 * @param {string} [metadata.moduleName]
 */
export const test = (func, tests, { moduleName } = {}) => {
	tests.forEach((test, index) => {
		const { input, output: expected } = test;
		const actual = Array.isArray(input) ? func(...input) : func(input);

		// array index starts at 0, but we want to count from 1
		const testIndex = index + 1;
		const testID = moduleName ? `${moduleName}, ${func.name}` : func.name;

		const passMessage = `${testID} #${testIndex}: PASSED`;
		const failMessage = `${testID} #${testIndex}: FAILED (expected '${actual}' to equal '${expected}')`;

		areEqual(expected, actual)
			? console.log(greenCode, passMessage, resetCode)
			: console.log(redCode, failMessage, resetCode);
	});
};
