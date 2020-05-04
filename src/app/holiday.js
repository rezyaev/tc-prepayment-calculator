/** @file Module for working with Russian Federation holidays */

import { getUTCCurrentYear } from '../libs/date.js';

/**
 * Get official holidays in Russian Federation
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
