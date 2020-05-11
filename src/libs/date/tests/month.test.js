import { test } from '../../unit-testing.js';
import { getUTCLastDateInMonth, getUTCDatesByMonth } from '../month.js';

const aprilIndex = 3;
const lastDateInApril = new Date(Date.UTC(2020, aprilIndex, 30));

const aprilDates = [
	new Date(Date.UTC(2020, aprilIndex, 1)),
	new Date(Date.UTC(2020, aprilIndex, 2)),
	new Date(Date.UTC(2020, aprilIndex, 3)),
	new Date(Date.UTC(2020, aprilIndex, 4)),
	new Date(Date.UTC(2020, aprilIndex, 5)),
	new Date(Date.UTC(2020, aprilIndex, 6)),
	new Date(Date.UTC(2020, aprilIndex, 7)),
	new Date(Date.UTC(2020, aprilIndex, 8)),
	new Date(Date.UTC(2020, aprilIndex, 9)),
	new Date(Date.UTC(2020, aprilIndex, 10)),
	new Date(Date.UTC(2020, aprilIndex, 11)),
	new Date(Date.UTC(2020, aprilIndex, 12)),
	new Date(Date.UTC(2020, aprilIndex, 13)),
	new Date(Date.UTC(2020, aprilIndex, 14)),
	new Date(Date.UTC(2020, aprilIndex, 15)),
	new Date(Date.UTC(2020, aprilIndex, 16)),
	new Date(Date.UTC(2020, aprilIndex, 17)),
	new Date(Date.UTC(2020, aprilIndex, 18)),
	new Date(Date.UTC(2020, aprilIndex, 19)),
	new Date(Date.UTC(2020, aprilIndex, 20)),
	new Date(Date.UTC(2020, aprilIndex, 21)),
	new Date(Date.UTC(2020, aprilIndex, 22)),
	new Date(Date.UTC(2020, aprilIndex, 23)),
	new Date(Date.UTC(2020, aprilIndex, 24)),
	new Date(Date.UTC(2020, aprilIndex, 25)),
	new Date(Date.UTC(2020, aprilIndex, 26)),
	new Date(Date.UTC(2020, aprilIndex, 27)),
	new Date(Date.UTC(2020, aprilIndex, 28)),
	new Date(Date.UTC(2020, aprilIndex, 29)),
	new Date(Date.UTC(2020, aprilIndex, 30)),
];

test(getUTCLastDateInMonth, [
	{
		input: [aprilIndex, 2020],
		output: lastDateInApril,
	},
]);

test(getUTCDatesByMonth, [
	{
		input: aprilIndex,
		output: aprilDates,
	},
]);
