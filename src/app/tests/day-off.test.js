import { isUTCDayOff } from '../day-off.js';
import { test } from '../../libs/unit-testing.js';

const saturday = new Date(Date.UTC(2020, 4, 2));
const internationalWomenDay = new Date(Date.UTC(2020, 2, 8));
const transferredHolidayDayOff = new Date(Date.UTC(2020, 4, 4));
const mondayWorkday = new Date(Date.UTC(2020, 4, 18));

test(isUTCDayOff, [
	{
		input: saturday,
		output: true,
	},
	{
		input: internationalWomenDay,
		output: true,
	},
	{
		input: transferredHolidayDayOff,
		output: true,
	},
	{
		input: mondayWorkday,
		output: false,
	},
]);
