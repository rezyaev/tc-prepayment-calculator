/** @file Module for working with javascript date object */

/**
 * Check if UTC date is Saturday
 *
 * @example
 * const saturday = new Date(Date.UTC(2020, 4, 9));
 * isUTCSaturday(saturday); // true
 *
 * @example
 * const monday = new Date(Date.UTC(2020, 4, 4));
 * isUTCSaturday(monday); // false
 *
 * @param {Date} date
 * @returns {boolean}
 */
export const isUTCSaturday = (date) => {
	const saturdayIndex = 6;
	return date.getUTCDay() === saturdayIndex;
};

/**
 * Check if UTC date is Sunday
 *
 * @example
 * const sunday = new Date(Date.UTC(2020, 4, 10));
 * isUTCSaturday(sunday); // true
 *
 * @example
 * const monday = new Date(Date.UTC(2020, 4, 4));
 * isUTCSaturday(monday); // false
 *
 * @param {Date} date
 * @returns {boolean}
 */
export const isUTCSunday = (date) => {
	const sundayIndex = 0;
	return date.getUTCDay() === sundayIndex;
};

/**
 * Check if UTC date is Saturday or Sunday
 *
 * @example
 * const saturday = new Date(Date.UTC(2020, 4, 9));
 * isUTCWeekend(saturday); // true
 *
 * @example
 * const sunday = new Date(Date.UTC(2020, 4, 10));
 * isUTCWeekend(sunday); // true
 *
 * @example
 * const monday = new Date(Date.UTC(2020, 4, 4));
 * isUTCWeekend(monday); // false
 *
 * @param {Date} date
 * @returns {boolean}
 */
export const isUTCWeekend = (date) => isUTCSaturday(date) || isUTCSunday(date);

/**
 * Get current UTC year
 *
 * @example
 * // Now is "Tue, 05 May 2020 13:11:57 GMT"
 * getUTCCurrentYear(); // 2020
 *
 * @returns {number}
 */
export const getUTCCurrentYear = () => new Date(Date.now()).getUTCFullYear();

/**
 * Check if dates array has the passed date (by value, not reference)
 *
 * @example
 * const date = new Date(Date.UTC(2020, 8, 16));
 * const sameDate = new Date(Date.UTC(2020, 8, 16));
 * const dates = [
 *   new Date(2020, 1, 4),
 *   sameDate,
 *   new Date(Date.UTC(2020, 4, 25))
 * ];
 *
 * isDateInArray(date, dates); // true
 *
 * @example
 * const date = new Date(Date.UTC(2020, 8, 16));
 * const dates = [
 *   new Date(2020, 1, 4),
 *   new Date(Date.UTC(2020, 4, 25))
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

/**
 * Move the passed date and return the new one
 * @param {Date} date
 * @param {object} moveValues
 * @param {number} [moveValues.years]
 * @param {number} [moveValues.months]
 * @param {number} [moveValues.days]
 * @returns {Date}
 */
export const moveUTCDate = (date, { years = 0, months = 0, days = 0 }) =>
	new Date(
		Date.UTC(
			date.getUTCFullYear() + years,
			date.getUTCMonth() + months,
			date.getUTCDate() + days
		)
	);

/**
 * @param {number} monthIndex
 * @param {number} [year]
 * @returns {Date}
 */
export const getUTCLastDateInMonth = (
	monthIndex,
	year = getUTCCurrentYear()
) => {
	/*
		Passing 0 as date to new Date() returns the last day of the previous month.
		Adding a 1 to month' index gives the last day of the current month.
	*/
	return new Date(Date.UTC(year, monthIndex + 1, 0));
};

/**
 * Get an array of dates between passed dates
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
 * Get an array of dates for passed month
 * @param {number} monthIndex
 * @returns {Date[]}
 */
export const getUTCDatesByMonth = (monthIndex) => {
	const currentYear = getUTCCurrentYear();
	const startDate = new Date(Date.UTC(currentYear, monthIndex, 1));
	const endDate = getUTCLastDateInMonth(monthIndex, currentYear);

	return getUTCDatesByRange(startDate, endDate);
};
