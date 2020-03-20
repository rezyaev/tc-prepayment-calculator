// @ts-check

/** @type {HTMLFormElement} */
const formElement = document.querySelector('form');
/** @type {HTMLSelectElement} */
const monthSelectElement = formElement.querySelector('#month');
/** @type {HTMLInputElement} */
const salaryInputElement = formElement.querySelector('#salary');
/** @type {HTMLParagraphElement} */
const prepaymentParagraphElement = document.querySelector('#prepayment');
/** @type {HTMLParagraphElement} */
const remainingSalaryParagraphElement = document.querySelector(
  '#remaining-salary'
);
/** @type {HTMLSpanElement} */
const prepaymentDateSpanElement = document.querySelector('#prepayment-date');
/** @type {HTMLSpanElement} */
const salaryDateSpanElement = document.querySelector('#salary-date');

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

/**
 * Calculate prepayment using this math:
 * ratio:
 *   all salary - all days
 *   prepayment - first half days
 *
 * find prepayment:
 *   prepayment = (all salary * first half days) / all days
 *
 * @param {string} month
 * @param {number} salary
 * @returns {number}
 */
const calculatePrepayment = (month, salary) => {
  const workdaysRatio = workdaysRatios[month];
  const firstHalf = workdaysRatio.firstHalf;
  const secondHalf = workdaysRatio.secondHalf;

  return (salary * firstHalf) / (firstHalf + secondHalf);
};

/**
 * Formats salary, inserting spaces every 3 digits and ruble sign
 * @example
 *   formatSalary(42566); // '42 466₽'
 *
 * @param {number} salary
 * @returns {string}
 */
const formatSalary = salary => {
  const spacedSalary = salary
    .toFixed()
    .split('')
    .reduceRight((formattedSalary, digit) => {
      const length = formattedSalary.length;

      if (length === 0) return digit;

      return formattedSalary.length % 3 === 0
        ? `${digit} ${formattedSalary}`
        : `${digit}${formattedSalary}`;
    }, '');

  return `${spacedSalary}₽`;
};

/**
 *
 * @param {string} month
 */
const displaySalaryDates = month => {
  const monthIndex = Object.keys(workdaysRatios).indexOf(month);

  const prepaymentDate = new Date(2020, monthIndex, 20);
  const salaryDate = new Date(2020, monthIndex + 1, 5);

  const options = { day: 'numeric', month: 'long' };
  prepaymentDateSpanElement.textContent = prepaymentDate.toLocaleDateString(
    'ru-RU',
    options
  );
  salaryDateSpanElement.textContent = salaryDate.toLocaleDateString(
    'ru-RU',
    options
  );
};

/**
 * Calculates salary division and displays it in html
 * @param {Event} event
 * @returns {void}
 */
const displaySalaryDivision = event => {
  event.stopPropagation();

  const month = monthSelectElement.value;
  const salary = parseInt(salaryInputElement.value, 10);

  displaySalaryDates(month);

  if (!salary) {
    prepaymentParagraphElement.textContent = 'N/D';
    remainingSalaryParagraphElement.textContent = 'N/D';

    return;
  }

  const prepayment = calculatePrepayment(month, salary);
  const remainingSalary = salary - prepayment;

  prepaymentParagraphElement.textContent = formatSalary(prepayment);
  remainingSalaryParagraphElement.textContent = formatSalary(remainingSalary);
};

document.addEventListener('DOMContentLoaded', displaySalaryDivision);
formElement.addEventListener('change', displaySalaryDivision);
formElement.addEventListener('input', displaySalaryDivision);
