/**
 * Get sources from cli arguments until it founds the given pattern.
 *
 * @param {string[]} cliArgs - Commonly process.argv.slice(2).
 * @param {regexp} pattern - Some pattern.
 * @example
 * // Call some command using the following sintax:
 * command *.js *.css {lib,src}/* --some option
 * -
 * const cliArgs = process.argv.slice(2);
 *
 * getCliArgsUntilPattern(cliArgs, /^-/); // > [*.js, *.css, {lib,src}/*]
 * @return {string[]}
 */
function getCliArgsUntilPattern (cliArgs, pattern) {

	const firstOptionMatchIndex = cliArgs.findIndex((value) => pattern.test(value));
	const sources = (firstOptionMatchIndex !== -1
		? cliArgs.slice(0, firstOptionMatchIndex)
		: cliArgs
	);

	return sources;

}

module.exports = getCliArgsUntilPattern;
