/** @file Module for calculating advance */

import { getUTCDatesByMonth } from '../libs/date/index.js';
import { isUTCDayOff } from './day-off.js';

/**
 * Calculates advance using this formula:
 * advance = (salary * month's first half workdays count) / all workdays count
 *
 * @example
 * calculateAdvance(2, 100000); // 42857
 *
 * @param {number} monthIndex
 * @param {number} salary
 * @returns {number}
 */
export const calculateAdvance = (monthIndex, salary) => {
	// get date arrays of first and second month's halves
	const monthSeparatorDay = 15;
	const dates = getUTCDatesByMonth(monthIndex);
	const firstHalfDates = dates.slice(0, monthSeparatorDay);
	const secondHalfDates = dates.slice(monthSeparatorDay, dates.length);

	// calculate how many workdays in first and second half
	const firstHalfWorkdaysCount = firstHalfDates.reduce(
		(workdaysCount, date) =>
			isUTCDayOff(date) ? workdaysCount : workdaysCount + 1,
		0
	);

	const secondHalfWorkdaysCount = secondHalfDates.reduce(
		(workdaysCount, date) =>
			isUTCDayOff(date) ? workdaysCount : workdaysCount + 1,
		0
	);

	// calculate and return advance
	return Math.floor(
		(salary * firstHalfWorkdaysCount) /
			(firstHalfWorkdaysCount + secondHalfWorkdaysCount)
	);
};
