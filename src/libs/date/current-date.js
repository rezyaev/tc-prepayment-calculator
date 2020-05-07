/** @file Module for working with current date's values */

/**
 * Gets current moment in time
 *
 * @returns {Date}
 */
export const getNow = () => new Date(Date.now());

/**
 * Gets current UTC year
 *
 * @example
 * // Now is "Tue, 05 May 2020 13:11:57 GMT"
 * getUTCCurrentYear(); // 2020
 *
 * @returns {number}
 */
export const getUTCCurrentYear = () => getNow().getUTCFullYear();
