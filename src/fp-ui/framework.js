/** @file Framework for writing fp-style web apps */

/**
 * @param {TemplateStringsArray} strings
 * @param  {...any} expressions
 * @returns {string}
 */
export const html = (strings, ...expressions) =>
	strings.reduce((result, string, index) => {
		const expression = Array.isArray(expressions[index])
			? expressions[index].join('')
			: expressions[index];

		return expression
			? `${result}${string}${expression}`
			: `${result}${string}`;
	}, '');

/**
 * @template State
 * @param {State} initialState
 * @param {(state: State, action: string, event: Event) => State} update
 * @param {(state: State) => string} view
 * @param {HTMLElement} element
 */
export const initializeApp = (initialState, update, view, element) => {
	element.innerHTML = view(initialState);
};
