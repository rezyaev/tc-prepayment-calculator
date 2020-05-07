/** @file Module for comparing primitive values and complex objects */

/**
 * @param {any[]} firstArray
 * @param {any[]} secondArray
 * @returns {boolean}
 */
const areArraysEqual = (firstArray, secondArray) => {
	if (firstArray.length === 0 && secondArray.length === 0) return true;
	if (firstArray.length !== secondArray.length) return false;

	const [firstArrayElement, ...remainingFirstArray] = firstArray;

	const secondArrayElement = secondArray.find((element) =>
		areEqual(firstArrayElement, element)
	);

	if (secondArrayElement !== undefined) {
		const secondArrayElementIndex = secondArray.indexOf(secondArrayElement);
		const remainingSecondArray = secondArray.filter(
			(element, index) => index !== secondArrayElementIndex
		);

		return areArraysEqual(remainingFirstArray, remainingSecondArray);
	}

	return false;
};

/**
 * @param {object} firstObject
 * @param {object} secondObject
 * @returns {boolean}
 */
const areObjectsEqual = (firstObject, secondObject) => {
	const firstObjectEntries = Object.entries(firstObject);
	const secondObjectEntries = Object.entries(secondObject);

	if (firstObjectEntries.length === 0 && secondObjectEntries.length === 0)
		return true;

	if (firstObjectEntries.length !== secondObjectEntries.length) return false;

	const [firstObjectEntry, ...remainingFirstEntries] = firstObjectEntries;

	const secondObjectEntry = secondObjectEntries.find((entry) =>
		areEqual(firstObjectEntry, entry)
	);

	if (secondObjectEntry !== undefined) {
		const remainingSecondEntries = secondObjectEntries.filter(
			(entry) => entry !== secondObjectEntry
		);

		const remainingFirstObject = Object.fromEntries(remainingFirstEntries);
		const remainingSecondObject = Object.fromEntries(remainingSecondEntries);

		return areObjectsEqual(remainingFirstObject, remainingSecondObject);
	}

	return false;
};

/**
 * @param {any} firstValue
 * @param {any} secondValue
 * @returns {boolean}
 */
export const areEqual = (firstValue, secondValue) => {
	if (firstValue === secondValue) return true;

	if (firstValue instanceof Date && secondValue instanceof Date)
		return firstValue.getTime() === secondValue.getTime();

	if (Array.isArray(firstValue) && Array.isArray(secondValue))
		return areArraysEqual(firstValue, secondValue);

	if (firstValue instanceof Object && secondValue instanceof Object)
		return areObjectsEqual(firstValue, secondValue);

	return false;
};
