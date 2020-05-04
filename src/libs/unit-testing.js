/*
    Functions for unit testing pure functions
*/

// ANSI escape codes for terminal font colors
const greenCode = '\x1b[32m';
const redCode = '\x1b[31m';
const resetCode = '\x1b[0m';

/**
 * @typedef {object} TestData
 * @property {any} input
 * @property {any} output
 */

/**
 * @param {(...args: any[]) => any} func
 * @param {TestData[]} tests
 * @param {object} [metadata]
 * @param {string} [metadata.moduleName]
 */
export const test = (func, tests, { moduleName } = {}) => {
	tests.forEach((test, index) => {
		const { input, output: expected } = test;
		const actual = Array.isArray(input) ? func(...input) : func(input);

		const testID = moduleName ? `${moduleName}, ${func.name}` : func.name;

		const passMessage = `${testID} #${index}: PASSED`;
		const failMessage = `${testID} #${index}: FAILED (expected '${actual}' to equal '${expected}')`;

		expected === actual
			? console.log(greenCode, passMessage, resetCode)
			: console.log(redCode, failMessage, resetCode);
	});
};
