# Nunjucks to HTML

![Cross OS CI](https://github.com/AlexisPuga/nunjucks-to-html/workflows/Cross%20OS%20CI/badge.svg)
[![npm version](https://badge.fury.io/js/nunjucks-to-html.svg)](https://badge.fury.io/js/nunjucks-to-html)

**Parse Nunjucks templates to HTML easily. You don't need Gulp nor Grunt to do it.**

*Keep your HTML clean and modularized by using a templating engine, like [Nunjucks](https://mozilla.github.io/nunjucks). Then, convert those files into HTML during your development process or even during production. This way, you can split your files, replace variables, etc... Why Nunjucks? Because it's heavily inspired by [Jinja2](https://jinja.palletsprojects.com/) but written for Javascript environments.*

## Installation

Via npm:
```cli
npm i nunjucks-to-html
```

Via yarn:
```cli
yarn add nunjucks-to-html
```

## Usage

Using this tool is as simple as installing it, and executing the following:
```cli
nunjucks-to-html
```

However, it's expected to be used in your package.json (in the "scripts" section):
```json
"scripts": {
  "build": "npm run build:html",
  "build:html": "nunjucks-to-html"
},
"devDependencies": {
  "nunjucks-to-html": "*"
}
```

Or importing it server side using:
```js
const nunjucksToHTML = require('nunjucks-to-html');
// Or: import nunjucksToHTML from 'nunjucks-to-html';
```

## CLI usage

```cli

Usage: nunjucks-to-html [sources] [flags...]

  --baseDir <path>        Base directory for the source files. Defaults to "".
  --config <filepath>     Filepath to the config file. Relative to cwd. Defaults to "nunjucks.config.js".
  --dest <path>           Path to the destination directory. Relative to cwd. Defaults to "public"
  --ext <string> 	  Extension for the destination file. Defaults to .html
  --cwd <path>            The path for the current working directory. Defaults to process.cwd().
  --flatten <boolean>     If present, flatten the source file name under the destination path. If absent, use the full source file name under the destination path. Defaults to false.

```

## CLI examples

To parse all `.njk` files and save them in `public/`:
  ```cli
  nunjucks-to-html
  ```

To parse all `.njk` files in `static/` and save them in `public/`:
  ```cli
  nunjucks-to-html --baseDir static
  ```

To parse `.njk` and `.html` files under the `static/` directory and save them in `public/static`:
  ```cli
  nunjucks-to-html static/**/*.{njk,html}
  ```

To configure the destination path, use the `--dest` flag:
  ```cli
  nunjucks-to-html --dest my-destination
  ```

To configure Nunjucks using a config. file:
  ```cli
  nunjucks-to-html
  ```
  ```js
  // nunjucks.config.js
  module.exports = {
    "options": {
      /**
       * A path to the file containing data for the template.
       * If you want to pass an object, use "render.context" instead.
       */
      "data": "some/path/on/cwd.js",
      /**
       * A hook that's called before calling nunjucks.render()
       * but after nunjucks.configure().
       *
       * Return false to skip rendering (and writing).
       */
      beforeRender (nunjucksEnv, renderName, renderData) { let nunjucks = this; },
      /**
       * A hook that's called after calling nunjucks.render()
       * but before writing to a file.
       *
       * Return false to skip writing.
       */
      beforeWrite (destinationFilepath, renderResult) { let nunjucks = this; }
    },

    /**
     * The following keys are members of Nunjucks.
     * To modify any parameter or see possible values,
     * plese check https://mozilla.github.io/nunjucks/api.html
     */

    // Executes nunjucks.configure([path], [options]).
    "configure": {
      "path": undefined,
      "options": {
        "autoescape": true,
        "throwOnUndefined": false,
        // ...
      }
    },

    // Executes nunjucks.render(name, [context], [callback]).
    "render": {
      "name": undefined, // You shouldn't change this.
      /**
       * An object literal containing the data for the template.
       * If you need to load data from a file, use "options.data" instead.
       * If you decide to use "options.data" too, this property will be assigned to it.
       */
      "context": {},
      "callback": () => {} // Not modificable.
    }

  };
  ```

To configure the name of the config file, use the `--config` flag:
  ```cli
  nunjucks-to-html --config njk.js
  ```

To call multiple jobs with different options, export an array of tasks:
  ```cli
  nunjucks-to-html
  ```
  ```js
  // nunjucks.config.js
  module.exports = [{
    "configure": {},
    "render": {}
  }, {
    "configure": {},
    "render": {}
  }, /* ... */];
  ```

To change the file extension of the destination file, use the `--ext` flag.
  ```cli
  nunjucks-to-html --ext .html
  ```

To flatten the source file name under the destination path, use the `--flatten` flag.
  ```cli
	nunjucks-to-html --flatten
  ```

To change the current working directory, use the `--cwd` flag:
  ```cli
  nunjucks-to-html --cwd /var/www
  ```

## Nodejs usage

The following are the default/supported parameters for this module:

```js
const nunjucksToHtml = require('nunjucks-to-html');

nunjucksToHtml(['**/*.njk'], {
  'config': 'nunjucks.config.js',
  'dest': 'public',
  'ext': '.html',
  'baseDir': '',
  'cwd': process.cwd(),
  'flatten': false
}).then((results) => {})
  .catch((error) => {});

// Produces the same result as calling:
// nunjucksToHtml().then((results) => {}).catch((error) => {});

```
