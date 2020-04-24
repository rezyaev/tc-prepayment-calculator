/**
 * Fetches template by URL and modifies shadow's inner HTML with it
 * @param {string} url
 * @param {ShadowRoot} shadow
 * @returns {Promise<void>}
 */
export const fetchTemplate = async (url, shadow) => {
	shadow.innerHTML = await (await fetch(url)).text();
};
