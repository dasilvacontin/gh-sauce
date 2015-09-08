'use strict'

/* globals describe, beforeEach, it */

var sauce = require('../')

describe('gh-sauce', function () {
  describe('#dress(text, config)', function () {
    beforeEach(function () {
      sauce.config.repo = 'https://github.com/mochajs/mocha'
    })

    it('should throw a TypeError if text is not a string', function () {
      (function () {
        sauce.dress(125)
        sauce.dress({foo: 'bar'})
      }).should.throw(TypeError)
    })

    it('should enhance usernames', function () {
      sauce.dress([
        'fix bail not running after hooks by @dasilvacontin',
        'email: dasilvacontin@gmail.com'
      ].join('\n')).should.equal([
        'fix bail not running after hooks by [@dasilvacontin]',
        'email: dasilvacontin@gmail.com',
        '',
        '[@dasilvacontin]: https://github.com/dasilvacontin',
        ''
      ].join('\n'))
    })

    it('should list usernames alphabetically', function () {
      sauce.dress('fix undefined lookup by @phillipj, @Formap and @dasilvacontin')
      .should.equal([
        'fix undefined lookup by [@phillipj], [@Formap] and [@dasilvacontin]',
        '',
        '[@dasilvacontin]: https://github.com/dasilvacontin',
        '[@Formap]: https://github.com/Formap',
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
      sauce.dress('fixes #26 and #27. fix lookup (#29)')
      .should.equal([
        'fixes [#26] and [#27]. fix lookup ([#29])',
        '',
        '[#26]: https://github.com/mochajs/mocha/issues/26',
        '[#27]: https://github.com/mochajs/mocha/issues/27',
        '[#29]: https://github.com/mochajs/mocha/issues/29',
        ''
      ].join('\n'))
    })

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

    it('should only have two newlines between end of text and link summary',
    function () {
      var dressed = [
        'fixes [#26]',
        '',
        '[#26]: https://github.com/mochajs/mocha/issues/26',
        ''
      ].join('\n')

      sauce.dress('fixes #26\n').should.equal(dressed)
      sauce.dress('fixes #26\n\n').should.equal(dressed)
      sauce.dress('fixes #26\n\n\n').should.equal(dressed)
      sauce.dress('fixes #26\t').should.equal(dressed)
      sauce.dress('fixes #26\t\n \n\t').should.equal(dressed)
    })

    it('should merge with an existing summary', function () {
      sauce.dress([
        'fixes #27 by @dasilvacontin',
        'fix thing [#26] by [@phillipj]',
        '',
        '[#26]: https://github.com/mochajs/mocha/issues/26',
        '',
        '[@phillipj]: https://github.com/phillipj',
        ''
      ].join('\n'))
      .should.equal([
        'fixes [#27] by [@dasilvacontin]',
        'fix thing [#26] by [@phillipj]',
        '',
        '[#26]: https://github.com/mochajs/mocha/issues/26',
        '[#27]: https://github.com/mochajs/mocha/issues/27',
        '',
        '[@dasilvacontin]: https://github.com/dasilvacontin',
        '[@phillipj]: https://github.com/phillipj',
        ''
      ].join('\n'))
    })

    describe('config', function () {
      it('should use `config.repo` for issue urls', function () {
        var config = {
          repo: 'https://github.com/dasilvacontin/gh-sauce'
        }

        sauce.dress('fixes #26', config)
        .should.equal([
          'fixes [#26]',
          '',
          '[#26]: https://github.com/dasilvacontin/gh-sauce/issues/26',
          ''
        ].join('\n'))
      })

      it('must be able to overwrite urls', function () {
        var config = {
          repo: 'https://github.com/dasilvacontin/gh-sauce'
        }

        sauce.dress([
          'fixes [#27]',
          '',
          '[#27]: https://github.com/mochajs/mocha/issues/27',
          ''
        ].join('\n'), config)
        .should.equal([
          'fixes [#27]',
          '',
          '[#27]: https://github.com/dasilvacontin/gh-sauce/issues/27',
          ''
        ].join('\n'))
      })

      it('should throw a TypeError for invalid config for `repo`', function () {
        (function () {
          var config = {
            repo: 56
          }
          sauce.dress('', config)
        }).should.throw()
      })

      it('should use `config.safe` for conserving existing urls', function () {
        var config = {
          safe: true
        }

        sauce.dress([
          'fixes #27 by @phillipj',
          'fix thing [#26] by [@phillipj]',
          '',
          '[#26]: https://github.com/mochajs/mocha/issues/26',
          '',
          '[@phillipj]: https://twitter.com/phillipjohnsen',
          ''
        ].join('\n'), config)
        .should.equal([
          'fixes [#27] by [@phillipj]',
          'fix thing [#26] by [@phillipj]',
          '',
          '[#26]: https://github.com/mochajs/mocha/issues/26',
          '[#27]: https://github.com/mochajs/mocha/issues/27',
          '',
          '[@phillipj]: https://twitter.com/phillipjohnsen',
          ''
        ].join('\n'))
      })

      it('should throw an Error if couldn\'t figure out `repo`', function () {
        process.chdir('test')
        delete require.cache[require.resolve('../')]
        sauce = require('../')

        ;(function missingPackage () {
          sauce.dress('w0l0l0')
        }).should.throw()

        process.chdir('..')
        delete require.cache[require.resolve('../')]
        sauce = require('../')
      })
    })
  })
  describe('#dressFile(path)', function () {

  })
})
