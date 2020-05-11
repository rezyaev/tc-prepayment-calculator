import { test } from '../../libs/unit-testing.js';
import { calculateAdvance } from '../advance-calculation.js';

const augustIndex = 7;
const mayIndex = 4;
const octoberIndex = 9;

test(calculateAdvance, [
	{
		input: [augustIndex, 50000],
		output: 23809,
	},
	{
		input: [mayIndex, 142000],
		output: 58470,
	},
	{
		input: [octoberIndex, 180000],
		output: 90000,
	},
]);
