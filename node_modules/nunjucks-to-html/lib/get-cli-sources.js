const getCliArgsUntilPattern = require('./get-cli-args-until-pattern');

/**
 * Get sources from cli arguments.
 *
 * @param {string[]} cliArgs - Commonly process.argv.slice(2).
 * @example
 * // Call some command using the following sintax:
 * command *.js *.css {lib,src}/* --some option
 * -
 * const cliArgs = process.argv.slice(2);
 *
 * getCliSources(cliArgs); // > [*.js, *.css, {lib,src}/*]
 * @return {string[]}
 */
function getCliSources (cliArgs) {

	return getCliArgsUntilPattern(cliArgs, /^\-/);

}

module.exports = getCliSources;
