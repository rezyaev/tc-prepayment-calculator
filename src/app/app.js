/*
	The main component in the app.
	All other components must be rendered inside it.
*/

import { calculateAdvance } from './modules/advance-calculation.js';
import { formatMoney } from './modules/money-formatting.js';
import { fetchTemplate } from './modules/template-fetching.js';

export class App extends HTMLElement {
	/** @type {HTMLParagraphElement} */ advanceParagraphElement;
	/** @type {HTMLParagraphElement} */ salaryParagraphElement;
	/** @type {HTMLSelectElement} */ monthSelectElement;
	/** @type {HTMLInputElement} */ salaryInputElement;
	/** @type {HTMLFormElement} */ formElement;
	/** @type {HTMLSpanElement} */ advanceDateSpanElement;
	/** @type {HTMLSpanElement} */ salaryDateSpanElement;

	shadow = this.attachShadow({ mode: 'closed' });

	constructor() {
		super();

		fetchTemplate('/src/app/app.html', this.shadow).then(() => {
			this.setReferences();
			this.setEventListeners();
			this.selectCurrentMonth();
			this.displaySalaryDates();
		});
	}

	setReferences() {
		this.formElement = this.shadow.querySelector('form');
		this.monthSelectElement = this.formElement.querySelector('#month-select');
		this.salaryInputElement = this.formElement.querySelector('#salary-input');
		this.advanceParagraphElement = this.shadow.querySelector('#advance');
		this.salaryParagraphElement = this.shadow.querySelector('#salary');
		this.advanceDateSpanElement = this.shadow.querySelector('#advance-date');
		this.salaryDateSpanElement = this.shadow.querySelector('#salary-date');
	}

	setEventListeners() {
		this.formElement.addEventListener('input', () =>
			this.displaySalaryDivision()
		);

		this.monthSelectElement.addEventListener('change', () => {
			this.displaySalaryDates();
		});
	}

	/**
	 * Finds current month and changes the value of select to it
	 */
	selectCurrentMonth() {
		const currentMonth = new Date().getMonth();
		this.monthSelectElement.value = currentMonth.toString();
	}

	/**
	 * Calculates salary division and displays it in HTML
	 * @returns {void}
	 */
	displaySalaryDivision() {
		const monthIndex = parseInt(this.monthSelectElement.value);
		const salary = parseInt(this.salaryInputElement.value);

		if (!salary || salary < 0 || salary > Number.MAX_SAFE_INTEGER) {
			this.advanceParagraphElement.textContent = 'N/D';
			this.salaryParagraphElement.textContent = 'N/D';

			return;
		}

		const advance = calculateAdvance(monthIndex, salary);
		const remainingSalary = salary - advance;

		this.advanceParagraphElement.textContent = formatMoney(advance);
		this.salaryParagraphElement.textContent = formatMoney(remainingSalary);
	}

	/**
	 * Finds in what dates salary will be paid and displays it in HTML
	 * @returns {void}
	 */
	displaySalaryDates() {
		const monthIndex = parseInt(this.monthSelectElement.value);

		const advanceDate = new Date(2020, monthIndex, 20);
		const salaryDate = new Date(2020, monthIndex + 1, 5);

		const options = { day: 'numeric', month: 'long' };
		this.advanceDateSpanElement.textContent = advanceDate.toLocaleDateString(
			'ru-RU',
			options
		);
		this.salaryDateSpanElement.textContent = salaryDate.toLocaleDateString(
			'ru-RU',
			options
		);
	}
}
