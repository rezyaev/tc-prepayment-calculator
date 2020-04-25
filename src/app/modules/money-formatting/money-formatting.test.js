import { formatMoney } from './money-formatting.js';
import { logTestResult } from '../test-results-logging.js';

const moduleName = 'MoneyFormatting';

export const testMoneyFormattingModule = () => {
	testFormatMoney();
};

const testFormatMoney = () => {
	const logTestFormatMoneyResult = logTestResult(moduleName, formatMoney.name);

	(() => {
		const expected = '22₽';
		const actual = formatMoney(22);

		logTestFormatMoneyResult(expected, actual);
	})();

	(() => {
		const expected = '100 000₽';
		const actual = formatMoney(100000);

		logTestFormatMoneyResult(expected, actual);
	})();

	(() => {
		const expected = '255 255 255₽';
		const actual = formatMoney(255255255);

		logTestFormatMoneyResult(expected, actual);
	})();
};
