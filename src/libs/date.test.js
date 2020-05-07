import { test } from './unit-testing.js';
import {
	isUTCSaturday,
	isUTCSunday,
	isUTCWeekend,
	isDateInArray,
	moveUTCDate
} from './date.js';

const date = new Date(Date.UTC(2020, 8, 16));

const monday = new Date(Date.UTC(2020, 4, 4));
const saturday = new Date(Date.UTC(2020, 4, 9));
const sunday = new Date(Date.UTC(2020, 4, 10));

test(isUTCSaturday, [
	{
		input: saturday,
		output: true
	},
	{
		input: monday,
		output: false
	}
]);

test(isUTCSunday, [
	{
		input: sunday,
		output: true
	},
	{
		input: monday,
		output: false
	}
]);

test(isUTCWeekend, [
	{
		input: saturday,
		output: true
	},
	{
		input: sunday,
		output: true
	},
	{
		input: monday,
		output: false
	}
]);

test(isDateInArray, [
	{
		input: [date, [new Date(2020, 1, 4), new Date(date.getTime())]],
		output: true
	},
	{
		input: [date, [new Date(2020, 1, 4), new Date(Date.UTC(2020, 4, 25))]],
		output: false
	}
]);

test(moveUTCDate, [
	{
		input: [date, { days: 2 }],
		output: new Date(
			Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 2)
		)
	}
]);
