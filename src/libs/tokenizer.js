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
const TokenizerState = {
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

/**
 * @param {string} html
 * @param {TokenizerState} [state]
 * @param {Token} [currentToken]
 * @returns {Token[]}
 */
export const tokenizeHtml = (
	html,
	state = TokenizerState.data,
	currentToken
) => {
	if (html.length === 0) return [];

	const [firstCharacter, ...restCharacters] = html;
	const restHtml = restCharacters.join('');

	switch (state) {
		case TokenizerState.data:
			return processDataState(firstCharacter, restHtml);

		case TokenizerState.tagOpen:
			return processTagOpenState(firstCharacter, restHtml);

		case TokenizerState.endTagOpen:
			return processEndTagOpenState(firstCharacter, restHtml);

		case TokenizerState.tagName:
			return processTagNameState(
				firstCharacter,
				restHtml,
				/** @type {TagToken} */ (currentToken)
			);

		case TokenizerState.beforeAttributeName:
			return processBeforeAttributeNameState(
				firstCharacter,
				restHtml,
				/** @type {StartTagToken} */ (currentToken)
			);

		case TokenizerState.attributeName:
			return processAttributeNameState(
				firstCharacter,
				restHtml,
				/** @type {StartTagToken} */ (currentToken)
			);

		case TokenizerState.afterAttributeName:
			return processAfterAttributeNameState(
				firstCharacter,
				restHtml,
				/** @type {StartTagToken} */ (currentToken)
			);

		case TokenizerState.beforeAttributeValue:
			return processBeforeAttributeValueState(
				firstCharacter,
				restHtml,
				/** @type {StartTagToken} */ (currentToken)
			);

		case TokenizerState.attributeValue:
			return processAttributeValueState(
				firstCharacter,
				restHtml,
				/** @type {StartTagToken} */ (currentToken)
			);

		case TokenizerState.afterAttributeValue:
			return processAfterAttributeValueState(
				firstCharacter,
				restHtml,
				/** @type {StartTagToken} */ (currentToken)
			);

		case TokenizerState.selfClosingStartTag:
			return processSelfClosingStartTagState(
				firstCharacter,
				restHtml,
				/** @type {StartTagToken} */ (currentToken)
			);
	}
};

/**
 * @param {string} character
 * @param {string} restHtml
 * @returns {Token[]}
 */
const processDataState = (character, restHtml) => {
	switch (character) {
		case '<':
			return tokenizeHtml(restHtml, TokenizerState.tagOpen);

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
const processTagOpenState = (character, restHtml) => {
	if (/[a-z]/i.test(character)) {
		/** @type {StartTagToken} */
		const token = { type: TokenType.startTag, tagName: '' };

		return tokenizeHtml(
			`${character}${restHtml}`,
			TokenizerState.tagName,
			token
		);
	}

	if (character === '/')
		return tokenizeHtml(restHtml, TokenizerState.endTagOpen);

	throw { name: 'ParseError', message: 'Invalid first character of tag name' };
};

/**
 * @param {string} character
 * @param {string} restHtml
 * @returns {Token[]}
 */
const processEndTagOpenState = (character, restHtml) => {
	if (/[a-z]/i.test(character)) {
		/** @type {EndTagToken} */
		const token = { type: TokenType.endTag, tagName: '' };

		return tokenizeHtml(
			`${character}${restHtml}`,
			TokenizerState.tagName,
			token
		);
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
const processTagNameState = (character, restHtml, currentToken) => {
	switch (character) {
		case '\t':
		case '\n':
		case ' ':
			return tokenizeHtml(
				restHtml,
				TokenizerState.beforeAttributeName,
				currentToken
			);

		case '/':
			return tokenizeHtml(
				restHtml,
				TokenizerState.selfClosingStartTag,
				currentToken
			);

		case '>':
			return [currentToken, ...tokenizeHtml(restHtml, TokenizerState.data)];

		default:
			/** @type {TagToken} */
			const updatedCurrentToken = {
				...currentToken,
				tagName: `${currentToken.tagName}${character.toLowerCase()}`,
			};

			return tokenizeHtml(
				restHtml,
				TokenizerState.tagName,
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
const processBeforeAttributeNameState = (character, restHtml, currentToken) => {
	switch (character) {
		case '\t':
		case '\n':
		case ' ':
			return tokenizeHtml(
				restHtml,
				TokenizerState.beforeAttributeName,
				currentToken
			);

		case '/':
			return tokenizeHtml(
				restHtml,
				TokenizerState.selfClosingStartTag,
				currentToken
			);

		case '>':
			return [currentToken, ...tokenizeHtml(restHtml, TokenizerState.data)];

		default:
			/** @type {StartTagToken} */
			const updatedCurrentToken = {
				...currentToken,
				attributes: [
					...(currentToken.attributes || []),
					{ name: character.toLowerCase(), value: '' },
				],
			};

			return tokenizeHtml(
				restHtml,
				TokenizerState.attributeName,
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
const processAttributeNameState = (character, restHtml, currentToken) => {
	switch (character) {
		case '\t':
		case '\n':
		case ' ':
			return tokenizeHtml(
				restHtml,
				TokenizerState.afterAttributeName,
				currentToken
			);

		case '/':
			return tokenizeHtml(
				restHtml,
				TokenizerState.selfClosingStartTag,
				currentToken
			);

		case '=':
			return tokenizeHtml(
				restHtml,
				TokenizerState.beforeAttributeValue,
				currentToken
			);

		case '>':
			return [currentToken, ...tokenizeHtml(restHtml, TokenizerState.data)];

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

			return processAttributeNameState(
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
const processAfterAttributeNameState = (character, restHtml, currentToken) => {
	switch (character) {
		case '\t':
		case '\n':
		case ' ':
			return tokenizeHtml(
				restHtml,
				TokenizerState.afterAttributeName,
				currentToken
			);

		case '/':
			return tokenizeHtml(
				restHtml,
				TokenizerState.selfClosingStartTag,
				currentToken
			);

		case '=':
			return tokenizeHtml(
				restHtml,
				TokenizerState.beforeAttributeValue,
				currentToken
			);

		case '>':
			return [currentToken, ...tokenizeHtml(restHtml, TokenizerState.data)];

		default:
			/** @type {StartTagToken} */
			const updatedCurrentToken = {
				...currentToken,
				attributes: [
					...currentToken.attributes,
					{ name: character.toLowerCase(), value: '' },
				],
			};

			return tokenizeHtml(
				restHtml,
				TokenizerState.attributeName,
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
const processBeforeAttributeValueState = (
	character,
	restHtml,
	currentToken
) => {
	switch (character) {
		case '\t':
		case '\n':
		case ' ':
			return tokenizeHtml(
				restHtml,
				TokenizerState.beforeAttributeValue,
				currentToken
			);

		case '>':
			return [currentToken, ...tokenizeHtml(restHtml, TokenizerState.data)];

		default:
			return tokenizeHtml(
				restHtml,
				TokenizerState.attributeValue,
				currentToken
			);
	}
};

/**
 * @param {string} character
 * @param {string} restHtml
 * @param {StartTagToken} [currentToken]
 * @returns {Token[]}
 */
const processAttributeValueState = (character, restHtml, currentToken) => {
	switch (character) {
		case '"':
			return tokenizeHtml(
				restHtml,
				TokenizerState.afterAttributeValue,
				currentToken
			);

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

			return processAttributeValueState(
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
const processAfterAttributeValueState = (character, restHtml, currentToken) => {
	switch (character) {
		case '\t':
		case '\n':
		case ' ':
			return tokenizeHtml(
				restHtml,
				TokenizerState.beforeAttributeName,
				currentToken
			);

		case '/':
			return tokenizeHtml(
				restHtml,
				TokenizerState.selfClosingStartTag,
				currentToken
			);

		case '>':
			return [currentToken, ...tokenizeHtml(restHtml, TokenizerState.data)];

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
const processSelfClosingStartTagState = (character, restHtml, currentToken) => {
	switch (character) {
		case '>':
			/** @type {StartTagToken} */
			const updatedCurrentToken = { ...currentToken, isSelfClosing: true };

			return [
				updatedCurrentToken,
				...tokenizeHtml(restHtml, TokenizerState.data),
			];

		default:
			throw { name: 'ParseError', message: 'Unexpected solidus in tag' };
	}
};
