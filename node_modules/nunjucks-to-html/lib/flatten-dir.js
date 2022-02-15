const path = require('path');

function flattenDir (filepath, destinationPath) {

	return path.join(destinationPath, path.basename(filepath))

}

module.exports = flattenDir;
