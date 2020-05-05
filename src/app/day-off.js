/** @file Module for working with day offs in Russian Federation */

import {
	isUTCWeekend,
	isUTCSaturday,
	isDateInArray,
	moveUTCDate
} from '../libs/date.js';
import { getHolidays, getHolidayTransferExceptions } from './holiday.js';

/**
 * Transfer holiday's day off if it is on a weekend or another holiday's date
 *
 * @param {Date} holiday
 * @param {Date[]} holidays
 * @returns {Date}
 */
const transferHoliday = (holiday, holidays) => {
	const exceptions = getHolidayTransferExceptions();

	// if holiday is an exception, transfer it as defined in an exception
	if (exceptions.has(holiday.getTime())) {
		return exceptions.get(holiday.getTime());
	}

	// check if a holiday is not on the weekend or another holiday's date
	if (!isUTCWeekend(holiday) && !isDateInArray(holiday, holidays))
		return holiday;

	// if Saturday transfer by 2 days till Monday, otherwise by 1
	const daysCountToMoveBy = isUTCSaturday(holiday) ? 2 : 1;

	const movedHoliday = moveUTCDate(holiday, { days: daysCountToMoveBy });

	/* 
		call recursively, because holiday can be on another holiday date after
		transfer, so we need to check again
	*/
	return transferHoliday(movedHoliday, holidays);
};

/**
 * Get holidays' day offs. If any holiday is on weekend, day off is transferred
 * to the next workday.
 *
 * @returns {Date[]}
 */
const getHolidayDayOffs = () => {
	const holidays = getHolidays();

	return holidays
		.reduce(
			(holidays, holiday) => [...holidays, transferHoliday(holiday, holidays)],
			[]
		)
		.sort((a, b) => a - b);
};

/**
 * Check if UTC date is a day off (because of weekend or holiday)
 *
 * @example <caption>Returns true for weekends</caption>
 * const saturday = new Date(Date.UTC(2020, 4, 2));
 * isUTCDayOff(saturday); // true
 *
 * @example <caption>Returns true for official holidays in Russian Federation</caption>
 * const internationalWomenDay = new Date(Date.UTC(2020, 2, 8));
 * isUTCDayOff(internationalWomenDay); // true
 *
 * @example <caption>Returns true for transferred holidays' day offs</caption>
 * // 4th May is transferred due to official decree
 * const transferredDayOff = new Date(Date.UTC(2020, 4, 4));
 * isUTCDayOff(transferredDayOff); // true
 *
 * @example <caption>Returns false for any other date</caption>
 * const justMonday = new Date(Date.UTC(2020, 4, 18));
 * isUTCDayOff(justMonday); // false
 *
 * @param {Date} date
 * @returns {boolean}
 */
export const isUTCDayOff = (date) =>
	isUTCWeekend(date) || isDateInArray(date, getHolidayDayOffs());
