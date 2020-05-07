/** @file Module for moving the date */

/**
 * Moves the passed UTC date and returns the new one
 *
 * @example <caption>Move date by 2 days</caption>
 * // Wed, 16 Sep 2020 00:00:00 GMT
 * const date = new Date(Date.UTC(2020, 8, 16));
 *
 * // Fri, 18 Sep 2020 00:00:00 GMT
 * moveUTCDate(date, { days: 2 });
 *
 * @example <caption>Move date by 3 months</caption>
 * // Wed, 16 Sep 2020 00:00:00 GMT
 * const date = new Date(Date.UTC(2020, 8, 16));
 *
 * // Wed, 16 Dec 2020 00:00:00 GMT
 * moveUTCDate(date, { months: 3 });
 *
 * @example <caption>Move date by 1 year</caption>
 * // Wed, 16 Sep 2020 00:00:00 GMT
 * const date = new Date(Date.UTC(2020, 8, 16));
 *
 * // Thu, 16 Sep 2021 00:00:00 GMT
 * moveUTCDate(date, { years: 1 });
 *
 * @example <caption>Move date by 1 year, 3 months and 2 days</caption>
 * // Wed, 16 Sep 2020 00:00:00 GMT
 * const date = new Date(Date.UTC(2020, 8, 16));
 *
 * // Sat, 18 Dec 2021 00:00:00 GMT
 * moveUTCDate(date, { years: 1, months: 3, days: 2 });
 *
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
