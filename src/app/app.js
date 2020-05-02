/*
	The main component in the app.
	All other components must be rendered inside it.
*/

import { calculateAdvance } from './modules/advance-calculation.js';
import { formatMoney } from './money-formatting/money-formatting.js';

export class App extends HTMLElement {
	/** @type {HTMLParagraphElement} */ advanceParagraph;
	/** @type {HTMLParagraphElement} */ salaryParagraph;
	/** @type {HTMLSelectElement} */ monthSelect;
	/** @type {HTMLInputElement} */ salaryInput;
	/** @type {HTMLFormElement} */ form;
	/** @type {HTMLSpanElement} */ advanceDateSpan;
	/** @type {HTMLSpanElement} */ salaryDateSpan;

	shadow = this.attachShadow({ mode: 'closed' });

	constructor() {
		super();

		this.fetchTemplate().then(() => {
			this.setReferences();
			this.setEventListeners();
			this.selectCurrentMonth();
			this.displaySalaryDates();
		});
	}

	async fetchTemplate() {
		this.shadow.innerHTML = await (await fetch('/src/app/app.html')).text();
	}

	setReferences() {
		// Rename without element
		this.form = this.shadow.querySelector('form');
		this.monthSelect = this.form.querySelector('#month-select');
		this.salaryInput = this.form.querySelector('#salary-input');
		this.advanceParagraph = this.shadow.querySelector('#advance');
		this.salaryParagraph = this.shadow.querySelector('#salary');
		this.advanceDateSpan = this.shadow.querySelector('#advance-date');
		this.salaryDateSpan = this.shadow.querySelector('#salary-date');
	}

	setEventListeners() {
		this.form.addEventListener('input', () => this.displaySalaryDivision());

		this.monthSelect.addEventListener('change', () => {
			this.displaySalaryDates();
		});
	}

	/**
	 * Finds current month and changes the value of select to it
	 */
	selectCurrentMonth() {
		const currentMonth = new Date().getMonth();
		this.monthSelect.value = currentMonth.toString();
	}

	/**
	 * Calculates salary division and displays it in HTML
	 * @returns {void}
	 */
	displaySalaryDivision() {
		const monthIndex = parseInt(this.monthSelect.value);
		const salary = parseInt(this.salaryInput.value);

		if (!salary || salary < 0 || salary > Number.MAX_SAFE_INTEGER) {
			this.advanceParagraph.textContent = 'N/D';
			this.salaryParagraph.textContent = 'N/D';

			return;
		}

		const advance = calculateAdvance(monthIndex, salary);
		const remainingSalary = salary - advance;

		this.advanceParagraph.textContent = formatMoney(advance);
		this.salaryParagraph.textContent = formatMoney(remainingSalary);
	}

	/**
	 * Finds in what dates salary will be paid and displays it in HTML
	 * @returns {void}
	 */
	displaySalaryDates() {
		const monthIndex = parseInt(this.monthSelect.value);

		const advanceDate = new Date(2020, monthIndex, 20);
		const salaryDate = new Date(2020, monthIndex + 1, 5);

		const options = { day: 'numeric', month: 'long' };
		this.advanceDateSpan.textContent = advanceDate.toLocaleDateString(
			'ru-RU',
			options
		);
		this.salaryDateSpan.textContent = salaryDate.toLocaleDateString(
			'ru-RU',
			options
		);
	}
}
