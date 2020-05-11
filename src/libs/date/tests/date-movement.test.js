import { test } from '../../unit-testing.js';
import { moveUTCDate } from '../date-movement.js';

const originDate = new Date(Date.UTC(2020, 8, 16));

test(moveUTCDate, [
	{
		input: [originDate, { days: 2 }],
		output: new Date(
			Date.UTC(
				originDate.getUTCFullYear(),
				originDate.getUTCMonth(),
				originDate.getUTCDate() + 2
			)
		),
	},
	{
		input: [originDate, { months: 3 }],
		output: new Date(
			Date.UTC(
				originDate.getUTCFullYear(),
				originDate.getUTCMonth() + 3,
				originDate.getUTCDate()
			)
		),
	},
	{
		input: [originDate, { years: 1 }],
		output: new Date(
			Date.UTC(
				originDate.getUTCFullYear() + 1,
				originDate.getUTCMonth(),
				originDate.getUTCDate()
			)
		),
	},
	{
		input: [originDate, { days: 2, months: 3, years: 1 }],
		output: new Date(
			Date.UTC(
				originDate.getUTCFullYear() + 1,
				originDate.getUTCMonth() + 3,
				originDate.getUTCDate() + 2
			)
		),
	},
]);
