# gh-sauce 
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image] [![Coverage Status][coveralls-image]][coveralls-url]

Enhance your GitHub repo's markdown files.

`gh-sauce` parses issues and usernames from markdown files and automatically converts them into links. Your markdown will remain clean and easy to read since the URLs will be listed at the end of the file.


## Example

Before:

```markdown

# CHANGELOG

## 2.1.1 / 11 June 2015

- Bugfix for using values from view's context prototype #442 by @phillipj.
- Only display result of master branch on travis badge by @nikolas.
- Upgrade assertion library for proper string diffs #459 by @dasilvacontin.

```

After:

```markdown

# CHANGELOG

## 2.1.1 / 11 June 2015

- Bugfix for using values from view's context prototype [#442] by [@phillipj].
- Only display result of master branch on travis badge by [@nikolas].
- Upgrade assertion library for proper string diffs [#459] by [@dasilvacontin].

[#442]: https://github.com/mochajs/mocha/issues/442
[#459]: https://github.com/mochajs/mocha/issues/459

[@dasilvacontin]: https://github.com/dasilvacontin
[@nikolas]: https://github.com/nikolas
[@phillipj]: https://github.com/phillipj

```


## Install

```bash
$ npm install -g gh-sauce
```


## Usage

```
  Usage: gh-sauce [options] <file ...>

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -s, --safe             Safe mode, doesn't overwrite existing urls
    -r, --repo <repo URL>  Provide default repo URL for issues
```

## API

_(Coming soon)_


## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [gulp](http://gulpjs.com/).


## License

Copyright (c) 2015 David da Silva Contín. Licensed under the MIT license.



[npm-url]: https://npmjs.org/package/gh-sauce
[npm-image]: https://badge.fury.io/js/gh-sauce.svg
[travis-url]: https://travis-ci.org/dasilvacontin/gh-sauce
[travis-image]: https://travis-ci.org/dasilvacontin/gh-sauce.svg?branch=master
[daviddm-url]: https://david-dm.org/dasilvacontin/gh-sauce.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/dasilvacontin/gh-sauce
[coveralls-url]: https://coveralls.io/r/dasilvacontin/gh-sauce?branch=master
[coveralls-image]: https://coveralls.io/repos/dasilvacontin/gh-sauce/badge.svg?branch=master
