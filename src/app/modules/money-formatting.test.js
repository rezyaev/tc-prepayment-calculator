import { formatMoney } from './money-formatting.js';
import { logTestResult } from './testing.js';

const moduleName = 'MoneyFormatting';

export const testMoneyFormattingModule = () => {
	testFormatMoney();
};

const testFormatMoney = () => {
	(() => {
		const expected = '22₽';
		const actual = formatMoney(22);

		logTestResult(expected, actual, moduleName, formatMoney.name, 1);
	})();

	(() => {
		const expected = '100 000₽';
		const actual = formatMoney(100000);

		logTestResult(expected, actual, moduleName, formatMoney.name, 2);
	})();

	(() => {
		const expected = '255 255 255₽';
		const actual = formatMoney(255255255);

		logTestResult(expected, actual, moduleName, formatMoney.name, 3);
	})();
};
