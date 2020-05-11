/** @file Component for advance calculation UI */

import { calculateAdvance } from '../app/advance-calculation.js';

export class AdvanceCalculation extends HTMLElement {
	constructor() {
		super();

		this.shadow = this.attachShadow({ mode: 'closed' });

		this.fetchTemplate().then(() => {
			this.setReferences();
			this.setEventListeners();
			this.selectCurrentMonth();
			this.displaySalaryDates();
		});
	}

	async fetchTemplate() {
		this.shadow.innerHTML = await (
			await fetch('/src/ui/advance-calculation.html')
		).text();
	}

	setReferences() {
		/** @type {HTMLFormElement} */
		this.form = this.shadow.querySelector('form');

		/** @type {HTMLSelectElement} */
		this.monthSelect = this.form.querySelector('#month-select');

		/** @type {HTMLInputElement} */
		this.salaryInput = this.form.querySelector('#salary-input');

		/** @type {HTMLParagraphElement} */
		this.advanceParagraph = this.shadow.querySelector('#advance');

		/** @type {HTMLParagraphElement} */
		this.salaryParagraph = this.shadow.querySelector('#salary');

		/** @type {HTMLSpanElement} */
		this.advanceDateSpan = this.shadow.querySelector('#advance-date');

		/** @type {HTMLSpanElement} */
		this.salaryDateSpan = this.shadow.querySelector('#salary-date');
	}

	setEventListeners() {
		this.form.addEventListener('input', () => this.displaySalaryDivision());

		this.monthSelect.addEventListener('change', () => {
			this.displaySalaryDates();
		});
	}

	selectCurrentMonth() {
		const currentMonth = new Date().getMonth();
		this.monthSelect.value = currentMonth.toString();
	}

	/**
	 * Displays salary/advance division
	 *
	 * @returns {void}
	 */
	displaySalaryDivision() {
		const monthIndex = parseInt(this.monthSelect.value);
		const salary = parseInt(this.salaryInput.value);

		// validate salary
		if (!salary || salary < 0 || salary > Number.MAX_SAFE_INTEGER) {
			this.advanceParagraph.textContent = 'N/D';
			this.salaryParagraph.textContent = 'N/D';

			return;
		}

		const advance = calculateAdvance(monthIndex, salary);
		const remainingSalary = salary - advance;

		const formatOptions = {
			style: 'currency',
			currency: 'RUB',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		};

		this.advanceParagraph.textContent = advance.toLocaleString(
			'ru-RU',
			formatOptions
		);

		this.salaryParagraph.textContent = remainingSalary.toLocaleString(
			'ru-RU',
			formatOptions
		);
	}

	/**
	 * Displays in what dates salary will be paid
	 *
	 * @returns {void}
	 */
	displaySalaryDates() {
		const currentYear = new Date().getUTCFullYear();
		const monthIndex = parseInt(this.monthSelect.value);
		const advanceDateNumber = 20;
		const salaryDateNumber = 5;

		const advanceDate = new Date(currentYear, monthIndex, advanceDateNumber);
		const salaryDate = new Date(currentYear, monthIndex + 1, salaryDateNumber);

		const formatOptions = { day: 'numeric', month: 'long' };

		this.advanceDateSpan.textContent = advanceDate.toLocaleDateString(
			'ru-RU',
			formatOptions
		);

		this.salaryDateSpan.textContent = salaryDate.toLocaleDateString(
			'ru-RU',
			formatOptions
		);
	}
}
