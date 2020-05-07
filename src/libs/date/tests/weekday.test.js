import { test } from '../../unit-testing.js';
import { isUTCSaturday, isUTCSunday, isUTCWeekend } from '../weekday.js';

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
