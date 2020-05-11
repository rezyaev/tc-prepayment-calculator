/** @file Component for advance calculation UI */

import { html, initializeApp } from './framework.js';

// --- STATE ---

/**
 * @typedef {object} State
 * @property {string[]} months
 * @property {number} [salary]
 * @property {number} [monthIndex]
 */

/** @type {State} */
const initialState = {
	months: [
		'Январь',
		'Февраль',
		'Март',
		'Апрель',
		'Май',
		'Июнь',
		'Июль',
		'Август',
		'Сентябрь',
		'Октябрь',
		'Ноябрь',
		'Декабрь'
	]
};

// --- UPDATE ---

/** @enum {string} */
const Actions = {};

/**
 * @param {State} state
 * @param {Actions} action
 * @returns {State}
 */
const update = (state, action) => state;

// --- VIEW ---

/**
 * @param {State} state
 * @returns {string}
 */
const view = ({ months }) => html`
	<main>
		<h1>Калькулятор аванса</h1>

		<div class="salary-division">
			<div>
				<p class="payment-type">
					Аванс
					<span class="payment-date" id="advance-date"></span>
				</p>
				<p class="payment-value" id="advance">N/D</p>
			</div>

			<div>
				<p class="payment-type">
					Зарплата
					<span class="payment-date" id="salary-date"></span>
				</p>
				<p class="payment-value" id="salary">N/D</p>
			</div>
		</div>

		<form>
			<div class="form-group">
				<label for="salary-input">Зарплата</label>
				<input
					class="form-control"
					id="salary-input"
					type="number"
					min="0"
					max="9007199254740991"
				/>
			</div>

			<div class="form-group">
				<label for="month-select">Месяц</label>
				<select class="form-control" id="month-select">
					${months.map(
						(month, index) =>
							html`
								<option value="${index}">${month}</option>
							`
					)}
				</select>
			</div>
		</form>
	</main>
`;

initializeApp(initialState, update, view, document.body);
