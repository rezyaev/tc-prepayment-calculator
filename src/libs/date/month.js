/** @file Module for working with months' dates */

import { getUTCDatesByRange } from './dates-array.js';

/**
 * Gets the last UTC date in the passed month
 *
 * @example
 * const aprilIndex = 3;
 *
 * // Thu, 30 Apr 2020 00:00:00 GMT
 * getUTCLastDateInMonth(aprilIndex, 2020);
 *
 * @param {number} monthIndex
 * @param {number} [year]
 * @returns {Date}
 */
export const getUTCLastDateInMonth = (
	monthIndex,
	year = new Date().getUTCFullYear()
) => {
	/*
		Passing 0 as date to new Date() returns the last day of the previous month.
		Adding a 1 to month's index gives the last day of the current month.
	*/
	return new Date(Date.UTC(year, monthIndex + 1, 0));
};

/**
 * Get an array of dates for passed month
 *
 * @example
 * const aprilIndex = 3;
 *
 * // [2020-04-01T00:00:00.000Z, ..., 2020-04-30T00:00:00.000Z]
 * getUTCDatesByMonth(3);
 *
 * @param {number} monthIndex
 * @returns {Date[]}
 */
export const getUTCDatesByMonth = (monthIndex) => {
	const currentYear = new Date().getUTCFullYear();
	const startDate = new Date(Date.UTC(currentYear, monthIndex, 1));
	const endDate = getUTCLastDateInMonth(monthIndex, currentYear);

	return getUTCDatesByRange(startDate, endDate);
};
