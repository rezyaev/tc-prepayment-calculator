/*
    Testing utility functions
*/

// ANSI escape codes for terminal font colors
const greenCode = '\x1b[32m';
const redCode = '\x1b[31m';
const resetCode = '\x1b[0m';

const testIDOccurences = {}

/**
 * Compares expected and actual values then logs result to console
 * @param {string} moduleName
 * @param {string} functionName
 * @returns {(expected: any, actual: any) => void}
 */
export const logTestResult = (moduleName, functionName) => (
	expected,
	actual
) => {
	const testID = `${moduleName}, ${functionName}`;
	// const additionalInfo =
	// 	testNumber === undefined || testNumber === null ? '' : ` #${testNumber}`;

	const passMessage = `${testID}${additionalInfo}: PASSED`;
	const failMessage = `${testID}${additionalInfo}: FAILED (expected '${actual}' to equal '${expected}')`;

	expected === actual
		? console.log(greenCode, passMessage, resetCode)
		: console.log(redCode, failMessage, resetCode);
};
