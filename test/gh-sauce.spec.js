'use strict'

/* globals describe, it */

var sauce = require('../')
require('chai').should()

describe('gh-sauce', function () {
  describe('#dress(text)', function () {
    it('should throw a TypeError if text is not a string', function () {
      (function () {
        sauce.dress(125)
        sauce.dress({foo: 'bar'})
      }).should.throw(TypeError)
    })

    it('should enhance usernames', function () {
      sauce.dress('@janl@dasilvacontin\n@phillipj')
      .should.equal([
        'fix bail not running after hooks by [@dasilvacontin]',
        '',
        '[@dasilvacontin]: https://github.com/dasilvacontin',
        ''
      ].join('\n'))
    })

    it('should list usernames alphabetically', function () {
      sauce.dress('fix undefined lookup by @phillipj and @dasilvacontin')
      .should.equal([
        'fix undefined lookup by [@phillipj] and [@dasilvacontin]',
        '',
        '[@dasilvacontin]: https://github.com/dasilvacontin',
        '[@phillipj]: https://github.com/phillipj',
        ''
      ].join('\n'))
    })

    it('should enhance issues', function () {
      sauce.dress('fixes #26')
      .should.equal([
        'fixes [#26]',
        '',
        '[#26]: https://github.com/mochajs/mocha/issues/26',
        ''
      ].join('\n'))
    })

    it('should list issues in ascending order', function () {
      sauce.dress('fixes #26, #27 and #29')
      .should.equal([
        'fixes [#26], [#27] and [#29]',
        '',
        '[#26]: https://github.com/mochajs/mocha/issues/26',
        '[#27]: https://github.com/mochajs/mocha/issues/27',
        '[#29]: https://github.com/mochajs/mocha/issues/29',
        ''
      ].join('\n'))

      it('should list issues first then usernames', function () {
        sauce.dress('#27 and #26 were fixed by @phillipj and @dasilvacontin')
        .should.equal([
          '[#27] and [#26] were fixed by [@phillipj] and [@dasilvacontin]',
          '',
          '[#26]: https://github.com/mochajs/mocha/issues/26',
          '[#27]: https://github.com/mochajs/mocha/issues/27',
          '',
          '[@dasilvacontin]: https://github.com/dasilvacontin',
          '[@phillipj]: https://github.com/phillipj',
          ''
        ].join('\n'))
      })
    })
  })
  describe('#dressFile(path)', function () {

  })
})
