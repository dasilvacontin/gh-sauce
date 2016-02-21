# gh-sauce <img src="https://i.gyazo.com/bcd1cedd5779493c02a6dc95db8c3735.png" alt="octocat holding shaved ice" height="300">

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][daviddm-url]][daviddm-image]
[![Coverage Status][coveralls-image]][coveralls-url]
[![NPM downloads per month][downloads-image]][downloads-url]

Enhance your GitHub repo's markdown files.

```markdown
$ cat CHANGELOG.md
# CHANGELOG

## 2.1.1 / 11 June 2015

- Bugfix for using values from view's context prototype #442 by @phillipj.
- Only display result of master branch on travis badge by @nikolas.
- Upgrade assertion library for proper string diffs #459 by @dasilvacontin.
```

```markdown
$ gh-sauce CHANGELOG.md
# Dressing CHANGELOG.md with some gh-sauce...

- [x] "CHANGELOG.md" was dressed with gh-sauce

Done! 🍧
```

```markdown
$ cat CHANGELOG.md
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

`gh-sauce` parses issues and usernames from markdown files and automatically converts them into links. Your markdown will remain clean and easy to read since the URLs will be listed (in alphanumeric order) at the end of the file.

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

```js
var sauce = require('gh-sauce')

var filename = 'CHANGELOG.md'

var sauceConfig = {
  // defaults to false
  safe: true
  // defaults to local package.json's homepage field
  repo: 'https://github.com/dasilvacontin/gh-sauce'
}

fs.readFile(filename, function (err, data) {
  var dressed = sauce.dress(data.toString(), sauceConfig)
  fs.writeFile(filename, dressed)
})
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [gulp](http://gulpjs.com/).


## License

MIT © [David da Silva](http://dasilvacont.in)

"Octocat with shaved ice" drawing by [Núria Balaguer](https://www.facebook.com/nixiescream)

[npm-url]: https://npmjs.org/package/gh-sauce
[npm-image]: https://badge.fury.io/js/gh-sauce.svg
[downloads-url]: https://www.npmjs.org/package/gh-sauce
[downloads-image]: http://img.shields.io/npm/dm/gh-sauce.svg
[travis-url]: https://travis-ci.org/dasilvacontin/gh-sauce
[travis-image]: https://travis-ci.org/dasilvacontin/gh-sauce.svg?branch=master
[daviddm-url]: https://david-dm.org/dasilvacontin/gh-sauce.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/dasilvacontin/gh-sauce
[coveralls-url]: https://coveralls.io/r/dasilvacontin/gh-sauce?branch=master
[coveralls-image]: https://coveralls.io/repos/dasilvacontin/gh-sauce/badge.svg?branch=master

[#442]: https://github.com/dasilvacontin/gh-sauce/issues/442
[#459]: https://github.com/dasilvacontin/gh-sauce/issues/459

[@dasilvacontin]: https://github.com/dasilvacontin
[@nikolas]: https://github.com/nikolas
[@phillipj]: https://github.com/phillipj

