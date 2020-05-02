/*
	Functions for working with official holidays in Russian Federation
*/

import {
	isUTCWeekend,
	isUTCSaturday,
	isDateInArray,
	moveUTCDate
} from './date.js';

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
 * Move holiday if it is on a weekend or another holiday's date
 * @param {Date} holiday
 * @param {Date[]} holidays
 * @returns {Date}
 */
const moveHoliday = (holiday, holidays) => {
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
	return moveHoliday(movedHoliday, holidays);
};

/**
 * If any holiday is on weekend, it is moved to the next workday
 * @type {Date[]}
 */
const movedHolidays = holidays
	.reduce(
		(holidays, holiday) => [...holidays, moveHoliday(holiday, holidays)],
		[]
	)
	.sort((a, b) => a - b);

/**
 * Check if date is on holiday or moved holiday.
 *
 * Moved holiday - is a holiday that was on weekend and then moved to the next
 * working day.
 *
 * @param {Date} date
 * @returns {boolean}
 */
export const isHoliday = (date) => isDateInArray(date, movedHolidays);
