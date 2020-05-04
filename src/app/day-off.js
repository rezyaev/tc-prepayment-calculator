/*
	Functions for working with official holidays in Russian Federation
*/

import {
	isUTCWeekend,
	isUTCSaturday,
	isDateInArray,
	moveUTCDate
} from '../libs/date.js';

const newYear = [
	new Date(Date.UTC(2020, 0, 1)),
	new Date(Date.UTC(2020, 0, 2)),
	new Date(Date.UTC(2020, 0, 3)),
	new Date(Date.UTC(2020, 0, 4)),
	new Date(Date.UTC(2020, 0, 5)),
	new Date(Date.UTC(2020, 0, 6)),
	new Date(Date.UTC(2020, 0, 8))
];

const christmas = new Date(Date.UTC(2020, 0, 7));
const fatherlandDefendersDay = new Date(Date.UTC(2020, 1, 23));
const internationalWomensDay = new Date(Date.UTC(2020, 2, 8));
const laborDay = new Date(Date.UTC(2020, 4, 1));
const victoryDay = new Date(Date.UTC(2020, 4, 9));
const russiaDay = new Date(Date.UTC(2020, 5, 12));
const nationalUnityDay = new Date(Date.UTC(2020, 10, 4));

/**
 * Array of official holidays in Russian Federation
 * @type {Date[]}
 */
const holidays = [
	...newYear,
	christmas,
	fatherlandDefendersDay,
	internationalWomensDay,
	laborDay,
	victoryDay,
	russiaDay,
	nationalUnityDay
];

/**
 * Exceptions are defined by Russian Federation government's decree:
 * http://static.government.ru/media/files/Dr1dQtbUqLa7QBUg1pbBasIKwwR7kJOG.pdf
 */
const transferHolidayExceptions = new Map([
	[new Date(Date.UTC(2020, 0, 4)).getTime(), new Date(Date.UTC(2020, 4, 4))],
	[new Date(Date.UTC(2020, 0, 5)).getTime(), new Date(Date.UTC(2020, 4, 5))]
]);

/**
 * Transfer holiday's day off if it is on a weekend or another holiday's date
 * @param {Date} holiday
 * @param {Date[]} holidays
 * @returns {Date}
 */
const transferHoliday = (holiday, holidays) => {
	// if holiday is an exception, transfer it as defined in a decree
	if (transferHolidayExceptions.has(holiday.getTime())) {
		return transferHolidayExceptions.get(holiday.getTime());
	}

	// check if a holiday is not on the weekend or another holiday's date
	if (!isUTCWeekend(holiday) && !isDateInArray(holiday, holidays))
		return holiday;

	// if Saturday move by 2 days till Monday, otherwise by 1
	const daysCountToMoveBy = isUTCSaturday(holiday) ? 2 : 1;

	const movedHoliday = moveUTCDate(holiday, { days: daysCountToMoveBy });

	/* 
		call recursively, because holiday can be on another holiday date after
		moving, so we need to move more
	*/
	return transferHoliday(movedHoliday, holidays);
};

/**
 * If any holiday is on weekend, day off is moved to the next workday
 * @type {Date[]}
 */
const holidayDayOffs = holidays
	.reduce(
		(holidays, holiday) => [...holidays, transferHoliday(holiday, holidays)],
		[]
	)
	.sort((a, b) => a - b);

/**
 * Check if UTC date is a day off (because of weekend or holiday)
 *
 * @param {Date} date
 * @returns {boolean}
 */
export const isUTCDayOff = (date) =>
	isUTCWeekend(date) || isDateInArray(date, holidayDayOffs);
