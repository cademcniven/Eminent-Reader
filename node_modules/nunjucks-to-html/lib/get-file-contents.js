const fs = require('fs');
const path = require('path');

/**
 * Get exported contents from a js/json file by calling require().
 *
 * @param {string} filepath
 * @param {string} basepath
 * @return {*} Contents from a js/json.
 */
function getFileContents (filepath, basepath) {

	const src = path.resolve(basepath || '', filepath);

	if (!fs.existsSync(src)) { throw new Error('File not found: ' + src); }

	return require(src);

}

module.exports = getFileContents;
