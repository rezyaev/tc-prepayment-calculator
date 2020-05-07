/** @file Module for working with arrays of dates */

import { moveUTCDate } from './date-movement.js';

/**
 * Gets an array of UTC dates between passed UTC dates
 *
 * @example
 * const startDate = new Date(Date.UTC(2020, 4, 7));
 * const endDate = new Date(Date.UTC(2020, 4, 10));
 *
 * // [
 * //   2020-05-07T00:00:00.000Z,
 * //   2020-05-08T00:00:00.000Z,
 * //   2020-05-09T00:00:00.000Z
 * //   2020-05-10T00:00:00.000Z
 * // ]
 * getUTCDatesByRange(startDate, endDate);
 *
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Date[]}
 */
export const getUTCDatesByRange = (startDate, endDate) => {
	if (startDate.getTime() === endDate.getTime()) {
		return [startDate];
	}

	const nextDate = moveUTCDate(startDate, { days: 1 });
	return [startDate, ...getUTCDatesByRange(nextDate, endDate)];
};

/**
 * Checks if dates array has the passed date (by value, not reference)
 *
 * @example
 * const date = new Date(Date.UTC(2020, 4, 10));
 * const sameDate = new Date(Date.UTC(2020, 4, 10));
 * const dates = [
 *   new Date(Date.UTC(2020, 4, 8)),
 *   new Date(Date.UTC(2020, 4, 9)),
 *   sameDate
 * ];
 *
 * isDateInArray(date, dates); // true
 *
 * @example
 * const date = new Date(Date.UTC(2020, 4, 10));
 * const dates = [
 *   new Date(Date.UTC(2020, 4, 8)),
 *   new Date(Date.UTC(2020, 4, 9))
 * ];
 *
 * isDateInArray(date, dates); // false
 *
 * @param {Date} date
 * @param {Date[]} dates
 * @returns {boolean}
 */
export const isDateInArray = (date, dates) =>
	dates.map((date) => date.getTime()).includes(date.getTime());
