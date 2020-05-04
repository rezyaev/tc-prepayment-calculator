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
 * @param {(arg: any) => any} func
 * @param {TestData[]} tests
 * @param {object} [metadata]
 * @param {string} [metadata.moduleName]
 */
export const test = (func, tests, { moduleName } = {}) => {
	tests.forEach((test, index) => {
		const actual = func(test.input);
		const expected = test.output;

		const testID = moduleName ? `${moduleName}, ${func.name}` : func.name;

		const passMessage = `${testID} #${index}: PASSED`;
		const failMessage = `${testID} #${index}: FAILED (expected '${actual}' to equal '${expected}')`;

		expected === actual
			? console.log(greenCode, passMessage, resetCode)
			: console.log(redCode, failMessage, resetCode);
	});
};
