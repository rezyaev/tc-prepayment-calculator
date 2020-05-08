/** @file Module for comparing primitive values and complex objects */

/**
 * Checks if two passed arrays are equal
 *
 * @param {any[]} firstArray
 * @param {any[]} secondArray
 * @returns {boolean}
 */
const areArraysEqual = (firstArray, secondArray) => {
	// empty array equals empty array
	if (firstArray.length === 0 && secondArray.length === 0) return true;

	// arrays with different lengths are not equal
	if (firstArray.length !== secondArray.length) return false;

	// get the first element from the first array
	// and try to find the same element in the second
	const [firstArrayElement, ...remainingFirstArray] = firstArray;
	const secondArrayElement = secondArray.find((element) =>
		areEqual(firstArrayElement, element)
	);

	// if the second array hasn't the such element, they are not equal
	if (secondArrayElement === undefined) return false;

	// get the second array without the found element
	const remainingSecondArray = secondArray.filter(
		(element, index) => index !== secondArray.indexOf(secondArrayElement)
	);

	// continue comparing the rest of the arrays
	return areArraysEqual(remainingFirstArray, remainingSecondArray);
};

/**
 * Checks if passed two values are equal. Complex types are compared by value,
 * not reference.
 *
 * @example <caption>Comparing primitives</caption>
 * // numbers
 * areEqual(13, 13); // true
 * areEqual(13, 25); // false
 *
 * // strings
 * areEqual('string', 'string'); // true
 * areEqual('string', 'not string'); // false
 *
 * // booleans
 * areEqual(true, true); // true
 * areEqual(true, false); // false
 *
 * @example <caption>Comparing dates</caption>
 * const firstDate = new Date(2020, 4, 7);
 * const firstDateClone = new Date(firstDate.getTime());
 * const secondDate = new Date(2020, 4, 9);
 *
 * areEqual(firstDate, firstDateClone); // true
 * areEqual(firstDate, secondDate); // false
 *
 * @example <caption>Comparing arrays</caption>
 * // order of items is not important and items' types can be anything
 * const array = [1, '2', 3, { a: 5 }, [true, true]];
 * const sameArray = ['2', { a: 5 }, 3, 1, [true, true]];
 *
 * areEqual(array, sameArray); // true
 * areEqual(array, [...sameArray, 4, 5]); // false
 *
 * @example <caption>Comparing objects</caption>
 * // order of properties is not important and properties' types can be anything
 * const object = {
 *   a: 1,
 *   bool: true,
 *   nested: {
 *     b: 1
 *   },
 *   array: [4, 5]
 * };
 *
 * const sameObject = {
 *   bool: true,
 *   a: 1,
 *   array: [4, 5],
 *   nested: {
 *     b: 1
 *   }
 * };
 *
 * areEqual(object, sameObject); // true
 * areEqual(object, { ...sameObject, c: 15 }); // false
 *
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

	if (firstValue instanceof Object && secondValue instanceof Object) {
		// objects are two-dimensional arrays, so compare them as arrays
		return areArraysEqual(
			Object.entries(firstValue),
			Object.entries(secondValue)
		);
	}

	return false;
};
