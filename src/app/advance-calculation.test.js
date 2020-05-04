import { test } from '../libs/unit-testing.js';
import { calculateAdvance } from './advance-calculation.js';

test(calculateAdvance, [
	{
		// August
		input: [7, 50000],
		output: 23809
	},
	{
		// May
		input: [4, 142000],
		output: 58470
	},
	{
		// October
		input: [9, 180000],
		output: 90000
	}
]);
