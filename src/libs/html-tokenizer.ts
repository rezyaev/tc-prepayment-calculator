/** @file Module for tokenizing HTML strings */

// TYPES

enum TokenType {
	character,
	startTag,
	endTag,
}

interface CharacterToken {
	type: TokenType.character;
	data: string;
};

interface Attribute {
	name: string;
	value: string;
};

interface StartTagToken {
	type: TokenType.startTag;
	tagName: string;
	isSelfClosing?: boolean;
	attributes?: Attribute[];
};

interface EndTagToken {
	type: TokenType.endTag;
	tagName: string;
};

type TagToken = StartTagToken | EndTagToken;

type Token = TagToken | CharacterToken;

enum State {
	data,
	tagOpen,
	endTagOpen,
	tagName,
	beforeAttributeName,
	attributeName,
	afterAttributeName,
	beforeAttributeValue,
	attributeValue,
	afterAttributeValue,
	selfClosingStartTag,
}

// ENTRY FUNCTION

/**
 * Tokenize html string.
 * Algorithm is a shortened version of the official HTML specification -
 * https://html.spec.whatwg.org/multipage/parsing.html#tokenization
 */
export const tokenizeHtml = (
	html: string,
	state: State = State.data,
	currentToken?: Token
): Token[] => {
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
				currentToken as TagToken
			);

		case State.beforeAttributeName:
			return beforeAttributeNameStateTokenize(
				firstCharacter,
				restHtml,
				currentToken as StartTagToken
			);

		case State.attributeName:
			return attributeNameStateTokenize(
				firstCharacter,
				restHtml,
				currentToken as StartTagToken
			);

		case State.afterAttributeName:
			return afterAttributeNameStateTokenize(
				firstCharacter,
				restHtml,
				currentToken as StartTagToken
			);

		case State.beforeAttributeValue:
			return beforeAttributeValueStateTokenize(
				firstCharacter,
				restHtml,
				currentToken as StartTagToken
			);

		case State.attributeValue:
			return attributeValueStateTokenize(
				firstCharacter,
				restHtml,
				currentToken as StartTagToken
			);

		case State.afterAttributeValue:
			return afterAttributeValueStateTokenize(
				firstCharacter,
				restHtml,
				currentToken as StartTagToken
			);

		case State.selfClosingStartTag:
			return selfClosingStartTagStateTokenize(
				firstCharacter,
				restHtml,
				currentToken as StartTagToken
			);
	}
};

// FUNCTIONS FOR EACH STATE

const dataStateTokenize = (character: string, restHtml: string): Token[] => {
	switch (character) {
		case '<':
			return tokenizeHtml(restHtml, State.tagOpen);

		default:
			const token: Token = { type: TokenType.character, data: character };

			return [token, ...tokenizeHtml(restHtml)];
	}
};

const tagOpenStateTokenize = (character: string, restHtml: string): Token[] => {
	if (/[a-z]/i.test(character)) {
		const token: Token = { type: TokenType.startTag, tagName: '' };

		return tokenizeHtml(`${character}${restHtml}`, State.tagName, token);
	}

	if (character === '/') return tokenizeHtml(restHtml, State.endTagOpen);

	throw { name: 'ParseError', message: 'Invalid first character of tag name' };
};

const endTagOpenStateTokenize = (
	character: string,
	restHtml: string
): Token[] => {
	if (/[a-z]/i.test(character)) {
		const token: EndTagToken = { type: TokenType.endTag, tagName: '' };

		return tokenizeHtml(`${character}${restHtml}`, State.tagName, token);
	}

	if (character === '>')
		throw { name: 'ParseError', message: 'Missing end tag name' };

	throw { name: 'ParseError', message: 'Invalid first character of tag name' };
};

const tagNameStateTokenize = (
	character: string,
	restHtml: string,
	currentToken: TagToken
): Token[] => {
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
			const updatedCurrentToken: TagToken = {
				...currentToken,
				tagName: `${currentToken.tagName}${character.toLowerCase()}`,
			};

			return tokenizeHtml(restHtml, State.tagName, updatedCurrentToken);
	}
};

const beforeAttributeNameStateTokenize = (
	character: string,
	restHtml: string,
	currentToken: StartTagToken
): Token[] => {
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
			const updatedCurrentToken: StartTagToken = {
				...currentToken,
				attributes: [
					...(currentToken.attributes || []),
					{ name: character.toLowerCase(), value: '' },
				],
			};

			return tokenizeHtml(restHtml, State.attributeName, updatedCurrentToken);
	}
};

const attributeNameStateTokenize = (
	character: string,
	restHtml: string,
	currentToken: StartTagToken
): Token[] => {
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
			const updatedAttribute: Attribute = {
				...lastAttribute,
				name: `${lastAttribute.name}${character.toLowerCase()}`,
			};

			/** @type {StartTagToken} */
			const updatedCurrentToken: StartTagToken = {
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

const afterAttributeNameStateTokenize = (
	character: string,
	restHtml: string,
	currentToken: StartTagToken
): Token[] => {
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
			const updatedCurrentToken: StartTagToken = {
				...currentToken,
				attributes: [
					...currentToken.attributes,
					{ name: character.toLowerCase(), value: '' },
				],
			};

			return tokenizeHtml(restHtml, State.attributeName, updatedCurrentToken);
	}
};

const beforeAttributeValueStateTokenize = (
	character: string,
	restHtml: string,
	currentToken: StartTagToken
): Token[] => {
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

const attributeValueStateTokenize = (
	character: string,
	restHtml: string,
	currentToken: StartTagToken
): Token[] => {
	switch (character) {
		case '"':
			return tokenizeHtml(restHtml, State.afterAttributeValue, currentToken);

		default:
			const { attributes } = currentToken;
			const [lastAttribute] = attributes.slice(-1);
			const restAttributes = attributes.slice(0, attributes.length - 1);

			/** @type {Attribute} */
			const updatedAttribute: Attribute = {
				...lastAttribute,
				value: `${lastAttribute.value}${character.toLowerCase()}`,
			};

			/** @type {StartTagToken} */
			const updatedCurrentToken: StartTagToken = {
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

const afterAttributeValueStateTokenize = (
	character: string,
	restHtml: string,
	currentToken: StartTagToken
): Token[] => {
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

const selfClosingStartTagStateTokenize = (
	character: string,
	restHtml: string,
	currentToken: StartTagToken
): Token[] => {
	switch (character) {
		case '>':
			/** @type {StartTagToken} */
			const updatedCurrentToken: StartTagToken = {
				...currentToken,
				isSelfClosing: true,
			};

			return [updatedCurrentToken, ...tokenizeHtml(restHtml, State.data)];

		default:
			throw { name: 'ParseError', message: 'Unexpected solidus in tag' };
	}
};
