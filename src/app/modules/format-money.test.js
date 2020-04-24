import { formatMoney } from './money-formatting.js';

export const testFormatMoney = () => {
	const expected = '100 000₽';
    const output = formatMoney(100000);

	console.assert(
		output === expected,
		`${testFormatMoney.name}: expected ${expected}, but got ${output}`
	);
};
