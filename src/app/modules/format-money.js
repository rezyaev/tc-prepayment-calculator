/**
 * Formats money, inserting spaces every 3 digits and adding ruble sign
 *
 * @example
 * formatSalary(42566); // '42 466₽'
 *
 * @param {number} money
 * @returns {string}
 */
export const formatMoney = (money) => {
	const spacedMoney = money
		.toFixed()
		.split('')
		.reduceRight((formattedSalary, digit) => {
			// length of string without spaces
			const length = formattedSalary.split(' ').join('').length;

			if (length === 0) return digit;

			// insert space after every 3rd digit
			return length % 3 === 0
				? `${digit} ${formattedSalary}`
				: `${digit}${formattedSalary}`;
		}, '');

	return `${spacedMoney}₽`;
};
