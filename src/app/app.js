export class App extends HTMLElement {
	constructor() {
		super();

		this.setTemplate().then(() => {
			this.setReferences();
			this.setEventListeners();
		});
	}

	async setTemplate() {
		const template = await (await fetch('/src/app/app.html')).text();

		this.shadow = this.attachShadow({ mode: 'closed' });
		this.shadow.innerHTML = template;
	}

	setReferences() {
		/** @type {HTMLFormElement} */
		this.formElement = this.shadow.querySelector('form');
		/** @type {HTMLSelectElement} */
		this.monthSelectElement = this.formElement.querySelector('#month-select');
		/** @type {HTMLInputElement} */
		this.salaryInputElement = this.formElement.querySelector('#salary-input');
		/** @type {HTMLParagraphElement} */
		this.prepaymentParagraphElement = this.shadow.querySelector('#prepayment');
		/** @type {HTMLParagraphElement} */
		this.salaryParagraphElement = this.shadow.querySelector('#salary');
		/** @type {HTMLSpanElement} */
		this.prepaymentDateSpanElement = this.shadow.querySelector('#advance-date');
		/** @type {HTMLSpanElement} */
		this.salaryDateSpanElement = this.shadow.querySelector('#salary-date');
	}

	setEventListeners() {
		this.formElement.addEventListener('input', (event) =>
			this.displaySalaryDivision(event)
		);
	}

	/**
	 * Calculate prepayment using this formula:
	 * prepayment = (all salary * first half days) / all days
	 *
	 * @example
	 * 	 calculatePrepayment('march', 100000); // 42857
	 *
	 * @param {string} month
	 * @param {number} salary
	 * @returns {number}
	 */
	calculatePrepayment(month, salary) {
		const workdaysRatio = workdaysRatios[month];
		const firstHalf = workdaysRatio.firstHalf;
		const secondHalf = workdaysRatio.secondHalf;

		return (salary * firstHalf) / (firstHalf + secondHalf);
	}

	/**
	 * Formats salary, inserting spaces every 3 digits and ruble sign
	 * @example
	 *   formatSalary(42566); // '42 466₽'
	 *
	 * @param {number} salary
	 * @returns {string}
	 */
	formatSalary(salary) {
		const spacedSalary = salary
			.toFixed()
			.split('')
			.reduceRight((formattedSalary, digit) => {
				// length of string without spaces
				const length = formattedSalary.split(' ').join('').length;

				if (length === 0) return digit;

				return length % 3 === 0
					? `${digit} ${formattedSalary}`
					: `${digit}${formattedSalary}`;
			}, '');

		return `${spacedSalary}₽`;
	}

	/**
	 * Finds in what dates salary will be paid and displays it in html
	 * @param {string} month
	 * @returns {void}
	 */
	displaySalaryDates(month) {
		const monthIndex = Object.keys(workdaysRatios).indexOf(month);

		const prepaymentDate = new Date(2020, monthIndex, 20);
		const salaryDate = new Date(2020, monthIndex + 1, 5);

		const options = { day: 'numeric', month: 'long' };
		this.prepaymentDateSpanElement.textContent = prepaymentDate.toLocaleDateString(
			'ru-RU',
			options
		);
		this.salaryDateSpanElement.textContent = salaryDate.toLocaleDateString(
			'ru-RU',
			options
		);
	}

	/**
	 * Calculates salary division and displays it in html
	 * @param {Event} event
	 * @returns {void}
	 */
	displaySalaryDivision(event) {
		event.stopPropagation();

		const month = this.monthSelectElement.value;
		const salary = parseInt(this.salaryInputElement.value, 10);

		this.displaySalaryDates(month);

		if (!salary || salary < 0 || salary > Number.MAX_SAFE_INTEGER) {
			this.prepaymentParagraphElement.textContent = 'N/D';
			this.salaryParagraphElement.textContent = 'N/D';

			return;
		}

		const prepayment = this.calculatePrepayment(month, salary);
		const remainingSalary = salary - prepayment;

		this.prepaymentParagraphElement.textContent = this.formatSalary(prepayment);
		this.salaryParagraphElement.textContent = this.formatSalary(
			remainingSalary
		);
	}
}

const workdaysRatios = {
	january: {
		firstHalf: 5,
		secondHalf: 12
	},
	february: {
		firstHalf: 10,
		secondHalf: 9
	},
	march: {
		firstHalf: 9,
		secondHalf: 12
	},
	april: {
		firstHalf: 11,
		secondHalf: 10
	},
	may: {
		firstHalf: 7,
		secondHalf: 10
	},
	june: {
		firstHalf: 10,
		secondHalf: 11
	},
	july: {
		firstHalf: 11,
		secondHalf: 12
	},
	august: {
		firstHalf: 10,
		secondHalf: 11
	},
	september: {
		firstHalf: 11,
		secondHalf: 11
	},
	october: {
		firstHalf: 11,
		secondHalf: 11
	},
	november: {
		firstHalf: 9,
		secondHalf: 11
	},
	december: {
		firstHalf: 11,
		secondHalf: 12
	}
};
