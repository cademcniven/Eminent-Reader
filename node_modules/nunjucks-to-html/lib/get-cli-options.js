const getCliArgsUntilPattern = require('./get-cli-args-until-pattern');

/**
 * Convert CLI arguments that match "--" and "-" into
 * an object literal.
 *
 * @param {string[]} cliArgs - Commonly process.argv
 * @example
 * getCliOptions([
 *     '--key1', 'value1',
 *     '-2', 'value2',
 *     '--3', 'value1 value2'
 * ]); // {'key1': 'value1', '2': 'value2', '3': ['value1', 'value2']}
 * @return {!object} An object literal.
 */
function getCliOptions (cliArgs) {

	return cliArgs.reduce((args, string, i) => {

		const value = cliArgs.slice(i + 1);

		if (/^--?(.+)/.test(string)) {

			const flagName = RegExp.$1;
			const flagValues = getCliArgsUntilPattern(value, /^-/);
			let flagValue = (flagValues.length === 1
				? flagValues[0]
				: flagValues
			);

			if (/^$|true/.test(flagValue)) { flagValue = true; }
			else if (flagValue === 'false') { flagValue = false; }

			args[flagName] = flagValue;

		}

		return args;

	}, {});

}

module.exports = getCliOptions;
