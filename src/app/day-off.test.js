import { isUTCDayOff } from './day-off.js';
import { test } from '../libs/unit-testing.js';

test(isUTCDayOff, [
	{
		input: new Date(Date.UTC(2020, 4, 4)),
		output: true
	}
]);
