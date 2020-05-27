/** @file Module for tokenizing HTML strings */

// === TYPES ===

/** @enum {string} */
const TokenType = {
	character: 'character',
	startTag: 'startTag',
	endTag: 'endTag',
};

/**
 * @typedef {object} CharacterToken
 * @property {TokenType} type
 * @property {string} data
 */

/**
 * @typedef {object} Attribute
 * @property {string} name
 * @property {string} value
 */

/**
 * @typedef {object} StartTagToken
 * @property {TokenType} type
 * @property {string} tagName
 * @property {boolean} [isSelfClosing]
 * @property {Attribute[]} [attributes]
 */

/**
 * @typedef {object} EndTagToken
 * @property {TokenType} type
 * @property {string} tagName
 */

/** @typedef {StartTagToken | EndTagToken} TagToken */

/** @typedef {CharacterToken | TagToken} Token */

/** @enum {string} */
const State = {
	data: 'data',
	tagOpen: 'tagOpen',
	endTagOpen: 'endTagOpen',
	tagName: 'tagName',
	beforeAttributeName: 'beforeAttributeName',
	attributeName: 'attributeName',
	afterAttributeName: 'afterAttributeName',
	beforeAttributeValue: 'beforeAttributeValue',
	attributeValue: 'attributeValue',
	afterAttributeValue: 'afterAttributeValue',
	selfClosingStartTag: 'selfClosingStartTag',
};

// === ENTRY FUNCTION ===

/**
 * Tokenize html string.
 * Algorithm is a shortened version of the official HTML specification -
 * https://html.spec.whatwg.org/multipage/parsing.html#tokenization
 *
 * @param {string} html
 * @param {State} [state]
 * @param {Token} [currentToken]
 * @returns {Token[]}
 */
export const tokenizeHtml = (html, state = State.data, currentToken) => {
	if (html.length === 0) return [];

	const [firstCharacter, ...restCharacters] = html;
	const restHtml = restCharacters.join('');

	switch (state) {
		case State.data:
			return dataStateTokenize(firstCharacter, restHtml);

		case State.tagOpen:
			return tagOpenStateTokenize(firstCharacter, restHtml);

		case State.endTagOpen:
			return endTagOpenStateTokenize(firstCharacter, restHtml);

		case State.tagName:
			return tagNameStateTokenize(
				firstCharacter,
				restHtml,
				/** @type {TagToken} */ (currentToken)
			);

		case State.beforeAttributeName:
			return beforeAttributeNameStateTokenize(
				firstCharacter,
				restHtml,
				/** @type {StartTagToken} */ (currentToken)
			);

		case State.attributeName:
			return attributeNameStateTokenize(
				firstCharacter,
				restHtml,
				/** @type {StartTagToken} */ (currentToken)
			);

		case State.afterAttributeName:
			return afterAttributeNameStateTokenize(
				firstCharacter,
				restHtml,
				/** @type {StartTagToken} */ (currentToken)
			);

		case State.beforeAttributeValue:
			return beforeAttributeValueStateTokenize(
				firstCharacter,
				restHtml,
				/** @type {StartTagToken} */ (currentToken)
			);

		case State.attributeValue:
			return attributeValueStateTokenize(
				firstCharacter,
				restHtml,
				/** @type {StartTagToken} */ (currentToken)
			);

		case State.afterAttributeValue:
			return afterAttributeValueStateTokenize(
				firstCharacter,
				restHtml,
				/** @type {StartTagToken} */ (currentToken)
			);

		case State.selfClosingStartTag:
			return selfClosingStartTagStateTokenize(
				firstCharacter,
				restHtml,
				/** @type {StartTagToken} */ (currentToken)
			);
	}
};

// === FUNCTIONS FOR EACH STATE ===

/**
 * @param {string} character
 * @param {string} restHtml
 * @returns {Token[]}
 */
const dataStateTokenize = (character, restHtml) => {
	switch (character) {
		case '<':
			return tokenizeHtml(restHtml, State.tagOpen);

		default:
			/** @type {CharacterToken} */
			const token = { type: TokenType.character, data: character };

			return [token, ...tokenizeHtml(restHtml)];
	}
};

/**
 * @param {string} character
 * @param {string} restHtml
 * @returns {Token[]}
 */
const tagOpenStateTokenize = (character, restHtml) => {
	if (/[a-z]/i.test(character)) {
		/** @type {StartTagToken} */
		const token = { type: TokenType.startTag, tagName: '' };

		return tokenizeHtml(`${character}${restHtml}`, State.tagName, token);
	}

	if (character === '/') return tokenizeHtml(restHtml, State.endTagOpen);

	throw { name: 'ParseError', message: 'Invalid first character of tag name' };
};

/**
 * @param {string} character
 * @param {string} restHtml
 * @returns {Token[]}
 */
const endTagOpenStateTokenize = (character, restHtml) => {
	if (/[a-z]/i.test(character)) {
		/** @type {EndTagToken} */
		const token = { type: TokenType.endTag, tagName: '' };

		return tokenizeHtml(`${character}${restHtml}`, State.tagName, token);
	}

	if (character === '>')
		throw { name: 'ParseError', message: 'Missing end tag name' };

	throw { name: 'ParseError', message: 'Invalid first character of tag name' };
};

/**
 * @param {string} character
 * @param {string} restHtml
 * @param {TagToken} [currentToken]
 * @returns {Token[]}
 */
const tagNameStateTokenize = (character, restHtml, currentToken) => {
	switch (character) {
		case '\t':
		case '\n':
		case ' ':
			return tokenizeHtml(restHtml, State.beforeAttributeName, currentToken);

		case '/':
			return tokenizeHtml(restHtml, State.selfClosingStartTag, currentToken);

		case '>':
			return [currentToken, ...tokenizeHtml(restHtml, State.data)];

		default:
			/** @type {TagToken} */
			const updatedCurrentToken = {
				...currentToken,
				tagName: `${currentToken.tagName}${character.toLowerCase()}`,
			};

			return tokenizeHtml(restHtml, State.tagName, updatedCurrentToken);
	}
};

/**
 * @param {string} character
 * @param {string} restHtml
 * @param {StartTagToken} [currentToken]
 * @returns {Token[]}
 */
const beforeAttributeNameStateTokenize = (
	character,
	restHtml,
	currentToken
) => {
	switch (character) {
		case '\t':
		case '\n':
		case ' ':
			return tokenizeHtml(restHtml, State.beforeAttributeName, currentToken);

		case '/':
			return tokenizeHtml(restHtml, State.selfClosingStartTag, currentToken);

		case '>':
			return [currentToken, ...tokenizeHtml(restHtml, State.data)];

		default:
			/** @type {StartTagToken} */
			const updatedCurrentToken = {
				...currentToken,
				attributes: [
					...(currentToken.attributes || []),
					{ name: character.toLowerCase(), value: '' },
				],
			};

			return tokenizeHtml(restHtml, State.attributeName, updatedCurrentToken);
	}
};

/**
 * @param {string} character
 * @param {string} restHtml
 * @param {StartTagToken} [currentToken]
 * @returns {Token[]}
 */
const attributeNameStateTokenize = (character, restHtml, currentToken) => {
	switch (character) {
		case '\t':
		case '\n':
		case ' ':
			return tokenizeHtml(restHtml, State.afterAttributeName, currentToken);

		case '/':
			return tokenizeHtml(restHtml, State.selfClosingStartTag, currentToken);

		case '=':
			return tokenizeHtml(restHtml, State.beforeAttributeValue, currentToken);

		case '>':
			return [currentToken, ...tokenizeHtml(restHtml, State.data)];

		default:
			const { attributes } = currentToken;
			const [lastAttribute] = attributes.slice(-1);
			const restAttributes = attributes.slice(0, attributes.length - 1);

			/** @type {Attribute} */
			const updatedAttribute = {
				...lastAttribute,
				name: `${lastAttribute.name}${character.toLowerCase()}`,
			};

			/** @type {StartTagToken} */
			const updatedCurrentToken = {
				...currentToken,
				attributes: [...restAttributes, updatedAttribute],
			};

			return attributeNameStateTokenize(
				restHtml[0],
				restHtml.slice(1),
				updatedCurrentToken
			);
	}
};

/**
 * @param {string} character
 * @param {string} restHtml
 * @param {StartTagToken} [currentToken]
 * @returns {Token[]}
 */
const afterAttributeNameStateTokenize = (character, restHtml, currentToken) => {
	switch (character) {
		case '\t':
		case '\n':
		case ' ':
			return tokenizeHtml(restHtml, State.afterAttributeName, currentToken);

		case '/':
			return tokenizeHtml(restHtml, State.selfClosingStartTag, currentToken);

		case '=':
			return tokenizeHtml(restHtml, State.beforeAttributeValue, currentToken);

		case '>':
			return [currentToken, ...tokenizeHtml(restHtml, State.data)];

		default:
			/** @type {StartTagToken} */
			const updatedCurrentToken = {
				...currentToken,
				attributes: [
					...currentToken.attributes,
					{ name: character.toLowerCase(), value: '' },
				],
			};

			return tokenizeHtml(restHtml, State.attributeName, updatedCurrentToken);
	}
};

/**
 * @param {string} character
 * @param {string} restHtml
 * @param {StartTagToken} [currentToken]
 * @returns {Token[]}
 */
const beforeAttributeValueStateTokenize = (
	character,
	restHtml,
	currentToken
) => {
	switch (character) {
		case '\t':
		case '\n':
		case ' ':
			return tokenizeHtml(restHtml, State.beforeAttributeValue, currentToken);

		case '>':
			return [currentToken, ...tokenizeHtml(restHtml, State.data)];

		default:
			return tokenizeHtml(restHtml, State.attributeValue, currentToken);
	}
};

/**
 * @param {string} character
 * @param {string} restHtml
 * @param {StartTagToken} [currentToken]
 * @returns {Token[]}
 */
const attributeValueStateTokenize = (character, restHtml, currentToken) => {
	switch (character) {
		case '"':
			return tokenizeHtml(restHtml, State.afterAttributeValue, currentToken);

		default:
			const { attributes } = currentToken;
			const [lastAttribute] = attributes.slice(-1);
			const restAttributes = attributes.slice(0, attributes.length - 1);

			/** @type {Attribute} */
			const updatedAttribute = {
				...lastAttribute,
				value: `${lastAttribute.value}${character.toLowerCase()}`,
			};

			/** @type {StartTagToken} */
			const updatedCurrentToken = {
				...currentToken,
				attributes: [...restAttributes, updatedAttribute],
			};

			return attributeValueStateTokenize(
				restHtml[0],
				restHtml.slice(1),
				updatedCurrentToken
			);
	}
};

/**
 * @param {string} character
 * @param {string} restHtml
 * @param {StartTagToken} [currentToken]
 * @returns {Token[]}
 */
const afterAttributeValueStateTokenize = (
	character,
	restHtml,
	currentToken
) => {
	switch (character) {
		case '\t':
		case '\n':
		case ' ':
			return tokenizeHtml(restHtml, State.beforeAttributeName, currentToken);

		case '/':
			return tokenizeHtml(restHtml, State.selfClosingStartTag, currentToken);

		case '>':
			return [currentToken, ...tokenizeHtml(restHtml, State.data)];

		default:
			throw {
				name: 'ParseError',
				message: 'Missing whitespace between attributes',
			};
	}
};

/**
 * @param {string} character
 * @param {string} restHtml
 * @param {StartTagToken} [currentToken]
 * @returns {Token[]}
 */
const selfClosingStartTagStateTokenize = (
	character,
	restHtml,
	currentToken
) => {
	switch (character) {
		case '>':
			/** @type {StartTagToken} */
			const updatedCurrentToken = { ...currentToken, isSelfClosing: true };

			return [updatedCurrentToken, ...tokenizeHtml(restHtml, State.data)];

		default:
			throw { name: 'ParseError', message: 'Unexpected solidus in tag' };
	}
};
