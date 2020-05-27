/* eslint-disable no-console */

import { tokenizeHtml } from '../tokenizer.js';
import { performance } from 'perf_hooks';

// eslint-disable-next-line immutable/no-let
let testNumber = 1;

// ANSI escape codes for terminal font colors
const greenCode = '\x1b[32m';
const cyanCode = '\x1b[36m';
const yellowCode = '\x1b[33m';
const resetCode = '\x1b[0m';

const testTokenizer = (input) => {
	const startTime = performance.now();
	const output = tokenizeHtml(input);
	const endTime = performance.now();

	console.log(yellowCode, `Tokenizer test #${testNumber}`);
	console.log(cyanCode, 'Output: ', output);
	console.log(
		greenCode,
		`Done in ${Math.round(endTime - startTime)} ms`,
		resetCode
	);

	testNumber += 1;
};

testTokenizer('<div>I am div!</div>');
testTokenizer('<div class="text-center" id="div">I am div!</div>');
testTokenizer(`
    <label for="salary-input">Зарплата</label>
    <input
        class="form-control"
        id="salary-input"
        type="number"
        min="0"
        max="9007199254740991"
    />
`);

testTokenizer(`
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
`);

testTokenizer(`
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
                <option value="index">month</option>
			</select>
		</div>
	</form>
</main>
`);
