/*
	Functions for working with javascript date object
*/

/**
 * @param {Date} date
 * @returns {boolean}
 */
export const isUTCSaturday = (date) => date.getUTCDay() === 6;

/**
 * @param {Date} date
 * @returns {boolean}
 */
export const isUTCSunday = (date) => date.getUTCDay() === 0;

/**
 * @param {Date} date
 * @returns {boolean}
 */
export const isUTCWeekend = (date) => isUTCSaturday(date) || isUTCSunday(date);

/**
 * Check if dates array has the passed date (by value, not reference)
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
 * Get an array of dates between passed dates
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Date[]}
 */
export const getUTCDates = (startDate, endDate) => {
	if (startDate.getTime() === endDate.getTime()) {
		return [startDate];
	}

	const nextDate = moveUTCDate(startDate, { days: 1 });
	return [startDate, ...getUTCDates(nextDate, endDate)];
};

/**
 * @returns {number}
 */
export const getUTCCurrentYear = () => new Date(Date.now()).getUTCFullYear();

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
