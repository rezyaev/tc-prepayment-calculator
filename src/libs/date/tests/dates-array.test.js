import { test } from '../../unit-testing.js';
import { getUTCDatesByRange, isDateInArray } from '../dates-array.js';

const startDate = new Date(Date.UTC(2020, 4, 7));
const endDate = new Date(Date.UTC(2020, 4, 10));
const middleDates = [
	new Date(Date.UTC(2020, 4, 8)),
	new Date(Date.UTC(2020, 4, 9)),
];

const dates = [...middleDates];
const date = new Date(Date.UTC(2020, 4, 10));
const sameDate = new Date(date.getTime());

test(getUTCDatesByRange, [
	{
		input: [startDate, endDate],
		output: [startDate, ...middleDates, endDate],
	},
]);

test(isDateInArray, [
	{
		input: [date, [...dates, sameDate]],
		output: true,
	},
	{
		input: [date, dates],
		output: false,
	},
]);
