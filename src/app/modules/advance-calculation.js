const workdaysRatios = [
	{
		firstHalf: 5,
		secondHalf: 12
	},
	{
		firstHalf: 10,
		secondHalf: 9
	},
	{
		firstHalf: 9,
		secondHalf: 12
	},
	{
		firstHalf: 11,
		secondHalf: 10
	},
	{
		firstHalf: 7,
		secondHalf: 10
	},
	{
		firstHalf: 10,
		secondHalf: 11
	},
	{
		firstHalf: 11,
		secondHalf: 12
	},
	{
		firstHalf: 10,
		secondHalf: 11
	},
	{
		firstHalf: 11,
		secondHalf: 11
	},
	{
		firstHalf: 11,
		secondHalf: 11
	},
	{
		firstHalf: 9,
		secondHalf: 11
	},
	{
		firstHalf: 11,
		secondHalf: 12
	}
];

/**
 * Calculate advance using this formula:
 * advance = (all salary * first half days) / all days
 *
 * @example
 * 	 calculateAdvance('march', 100000); // 42857
 *
 * @param {number} monthIndex
 * @param {number} salary
 * @returns {number}
 */
export const calculateAdvance = (monthIndex, salary) => {
	const workdaysRatio = workdaysRatios[monthIndex];
	const firstHalf = workdaysRatio.firstHalf;
	const secondHalf = workdaysRatio.secondHalf;

	return (salary * firstHalf) / (firstHalf + secondHalf);
};
