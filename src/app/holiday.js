/** @file Module for working with Russian Federation holidays */

import { getUTCCurrentYear } from '../libs/date/index.js';

/**
 * Gets official holidays in Russian Federation
 *
 * @returns {Date[]}
 */
export const getHolidays = () => {
	const currentYear = getUTCCurrentYear();

	const newYear = [
		new Date(Date.UTC(currentYear, 0, 1)),
		new Date(Date.UTC(currentYear, 0, 2)),
		new Date(Date.UTC(currentYear, 0, 3)),
		new Date(Date.UTC(currentYear, 0, 4)),
		new Date(Date.UTC(currentYear, 0, 5)),
		new Date(Date.UTC(currentYear, 0, 6)),
		new Date(Date.UTC(currentYear, 0, 8))
	];

	const christmas = new Date(Date.UTC(currentYear, 0, 7));
	const fatherlandDefendersDay = new Date(Date.UTC(currentYear, 1, 23));
	const internationalWomenDay = new Date(Date.UTC(currentYear, 2, 8));
	const laborDay = new Date(Date.UTC(currentYear, 4, 1));
	const victoryDay = new Date(Date.UTC(currentYear, 4, 9));
	const russiaDay = new Date(Date.UTC(currentYear, 5, 12));
	const nationalUnityDay = new Date(Date.UTC(currentYear, 10, 4));

	return [
		...newYear,
		christmas,
		fatherlandDefendersDay,
		internationalWomenDay,
		laborDay,
		victoryDay,
		russiaDay,
		nationalUnityDay
	];
};

/**
 * Gets exceptions that are defined by Russian Federation government's decree:
 * http://static.government.ru/media/files/Dr1dQtbUqLa7QBUg1pbBasIKwwR7kJOG.pdf
 *
 * @returns {Map<number, Date>} - Map, where keys are holiday's Unix times
 * and values are holidays' transfer Dates.
 */
export const getHolidayTransferExceptions = () =>
	new Map([
		[new Date(Date.UTC(2020, 0, 4)).getTime(), new Date(Date.UTC(2020, 4, 4))],
		[new Date(Date.UTC(2020, 0, 5)).getTime(), new Date(Date.UTC(2020, 4, 5))]
	]);
