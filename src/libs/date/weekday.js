/** @file Module for working with weekdays */

const saturdayIndex = 6;
const sundayIndex = 0;

/**
 * Checks if UTC date is Saturday
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
export const isUTCSaturday = (date) => date.getUTCDay() === saturdayIndex;

/**
 * Checks if UTC date is Sunday
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
export const isUTCSunday = (date) => date.getUTCDay() === sundayIndex;

/**
 * Checks if UTC date is Saturday or Sunday
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
