const path = require('path');
const glob = require('glob');

/**
 * Convert glob patterns to filepaths.
 *
 * @param {string[]} sources - An array of glob patterns.
 * @param {string} [baseDir=''] - Base directory for the sources.
 * @return {Promise} filepaths
 */
async function getFilepaths (sources, baseDir = '') {

	let tasks;

	if (!Array.isArray(sources)) { sources = [sources]; }

	tasks = sources.map(async (source) => await new Promise((resolve, reject) => {

		const src = path.resolve(baseDir, source);

		glob(src, (error, filepaths) => {

			if (error) { return void reject(error); }

			resolve(filepaths);

		});

	}));

	return await Promise
		.all(tasks)
		.then((results) => [].concat.apply([], results));

}

module.exports = getFilepaths;
