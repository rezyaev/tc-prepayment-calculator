/*
    Functions for logging results of tests
*/

// ANSI escape codes for terminal font colors
const greenCode = '\x1b[32m';
const redCode = '\x1b[31m';
const resetCode = '\x1b[0m';

/**
 * Stores how much times certain test IDs occurred
 *
 * @example
 * {
 *    'MoneyFormatting, formatMoney': 3,
 *    'AdvanceCalculation, calculateAdvance': 2
 * }
 *
 * @type {Object.<string, number>}
 */
const testIDOccurences = {};

/**
 * Compares expected and actual values then logs result to console
 *
 * @example
 * // firstly, give it test module's and function's names
 * const logCurrentTestResult = logTestResult('CurrentModule', 'currentFunction');
 *
 * // then, one or several times give it expected and actual values
 * logCurrentTestResult(1, 1)
 * // 'CurrentModule, currentFunction #1: PASSED
 *
 * logCurrentTestResult(2, 2)
 * // 'CurrentModule, currentFunction #2: PASSED
 *
 * logCurrentTestResult(3, 2)
 * // 'CurrentModule, currentFunction #2: FAILED (expected '3' to equal '2')
 *
 * @param {string} moduleName
 * @param {string} functionName
 * @returns {(expected: any, actual: any) => void}
 */
export const logTestResult = (moduleName, functionName) => (
	expected,
	actual
) => {
	const testID = `${moduleName}, ${functionName}`;
	const testNumber = getTestNumber(testID);

	const passMessage = `${testID} #${testNumber}: PASSED`;
	const failMessage = `${testID} #${testNumber}: FAILED (expected '${actual}' to equal '${expected}')`;

	expected === actual
		? console.log(greenCode, passMessage, resetCode)
		: console.log(redCode, failMessage, resetCode);
};

/**
 * Get test number based on how much times test ID occurred before
 * @param {string} testID
 */
const getTestNumber = (testID) => {
	// If test ID already occurred before add one, else store it the first time
	testIDOccurences[testID] = Object.keys(testIDOccurences).includes(testID)
		? (testIDOccurences[testID] += 1)
		: 1;

	return testIDOccurences[testID];
};
