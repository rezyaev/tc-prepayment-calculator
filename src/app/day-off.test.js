import { isUTCDayOff } from './day-off.js';
import { test } from '../libs/unit-testing.js';

test(isUTCDayOff, [
	{
		// Saturday
		input: new Date(Date.UTC(2020, 4, 2)),
		output: true
	},
	{
		// International Women Day
		input: new Date(Date.UTC(2020, 2, 8)),
		output: true
	},
	{
		// 4th May is transferred holiday's day off
		input: new Date(Date.UTC(2020, 4, 4)),
		output: true
	},
	{
		// just usual Monday workday
		input: new Date(Date.UTC(2020, 4, 18)),
		output: false
	}
]);
