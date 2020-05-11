import { test } from '../unit-testing.js';
import { areEqual } from '../equality.js';

const firstDate = new Date(2020, 4, 7);
const firstDateClone = new Date(firstDate.getTime());
const secondDate = new Date(2020, 4, 9);

const array = [1, '2', 3, { a: 5 }, [true, true]];
const sameArray = ['2', { a: 5 }, 3, 1, [true, true]];

const object = {
	a: 1,
	bool: true,
	nested: {
		b: 1,
	},
	array: [4, 5],
};

const sameObject = {
	bool: true,
	a: 1,
	array: [4, 5],
	nested: {
		b: 1,
	},
};

test(areEqual, [
	{
		input: [13, 13],
		output: true,
	},
	{
		input: [13, 25],
		output: false,
	},
	{
		input: ['string', 'string'],
		output: true,
	},
	{
		input: ['string', 'not string'],
		output: false,
	},
	{
		input: [true, true],
		output: true,
	},
	{
		input: [true, false],
		output: false,
	},
	{
		input: [firstDate, firstDateClone],
		output: true,
	},
	{
		input: [firstDate, secondDate],
		output: false,
	},
	{
		input: [array, sameArray],
		output: true,
	},
	{
		input: [array, [...sameArray, 4, 5]],
		output: false,
	},
	{
		input: [object, sameObject],
		output: true,
	},
	{
		input: [object, { ...sameObject, c: 15 }],
		output: false,
	},
]);
