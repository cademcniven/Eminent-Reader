const {join: pathJoin, sep: pathSep} = require('path');

/**
 * Include filepath into destinationPath.
 *
 * @TODO: Find a native way to do this.
 * @param {string} filepath
 * @param {string} destinationPath
 * @example
 * const filepath = 'static/js/index.js';
 * const destinationPath = 'public';
 * 
 * expandDir(filepath, destinationPath); // > "public/js/index.js"
 * @return {string} An absolute filepath.
 */
function expandDir (filepath, destinationPath) {

	// We strip the common path from both paths.
	const basedir = filepath.split('').reduce(
		(path, char, i) => (char === destinationPath.charAt(i) ? path + char : path),
		''
	).replace(/(\/|\\)[^/\\]+$/, '$1');
	const relativeFilepath = filepath.replace(basedir, '');
	const relativeDestinationFilepath = destinationPath.replace(basedir, '');
	// Then, we join the common basedir, the destination dir and the path to the file.
	const destinationFilepath = pathJoin(
		basedir,
		relativeDestinationFilepath,
		relativeFilepath
	);

	return destinationFilepath;

}

module.exports = expandDir;
