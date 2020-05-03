import {
	moveUTCDate,
	getUTCDates,
	getUTCLastDateInMonth,
	isUTCWeekend
} from '../common/date.js';
import { isHoliday } from './holiday.js';

/**
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {number}
 */
const getWorkdaysCountInDatesRange = (startDate, endDate) => {
	const dates = getUTCDates(startDate, endDate);

	return dates.reduce(
		(workdaysCount, date) =>
			isUTCWeekend(date) || isHoliday(date) ? workdaysCount : workdaysCount + 1,
		0
	);
};

/**
 * @param {number} monthIndex
 * @returns {[number, number]}
 */
const getWorkdaysRatioByMonth = (monthIndex) => {
	const monthStartDate = new Date(Date.UTC(2020, monthIndex, 1));
	const monthHalfDate = new Date(Date.UTC(2020, monthIndex, 15));
	const monthLastDate = getUTCLastDateInMonth(monthIndex);

	const firstHalfWorkdaysCount = getWorkdaysCountInDatesRange(
		monthStartDate,
		monthHalfDate
	);

	const secondHalfWorkdaysCount = getWorkdaysCountInDatesRange(
		moveUTCDate(monthHalfDate, { days: 1 }),
		monthLastDate
	);

	return [firstHalfWorkdaysCount, secondHalfWorkdaysCount];
};

/**
 * Calculate advance using this formula:
 * advance = (all salary * first half days) / all days
 *
 * @example
 * calculateAdvance('march', 100000); // 42857
 *
 * @param {number} monthIndex
 * @param {number} salary
 * @returns {number}
 */
export const calculateAdvance = (monthIndex, salary) => {
	const [firstHalf, secondHalf] = getWorkdaysRatioByMonth(monthIndex);
	return (salary * firstHalf) / (firstHalf + secondHalf);
};
