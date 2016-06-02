'use strict'

var test = require('tape')
var sauce = require('../')

sauce.config.repo = 'https://github.com/mochajs/mocha'

function longstr () {
  return Array.prototype.join.call(arguments, '\n')
}

test('gh-sauce', function (t) {
  t.test('validation', function (st) {
    st.plan(1)

    st.throws(function () {
      sauce.dress(125)
      sauce.dress({foo: 'bar'})
    }, TypeError, 'should throw a TypeError if text is not a string')
  })

  t.test('usernames', function (st) {
    st.plan(2)

    st.equal(sauce.dress(longstr(
      'fix bail not running after hooks by @dasilvacontin',
      'email: dasilvacontin@gmail.com'
      )), longstr(
      'fix bail not running after hooks by [@dasilvacontin]',
      'email: dasilvacontin@gmail.com',
      '',
      '[@dasilvacontin]: https://github.com/dasilvacontin',
      ''
    ), 'should enhance usernames')

    st.equal(sauce.dress(
      'fix undefined lookup by @phillipj, @Formap and ' + '@dasilvacontin'
    ), longstr(
      'fix undefined lookup by [@phillipj], [@Formap] and [@dasilvacontin]',
      '',
      '[@dasilvacontin]: https://github.com/dasilvacontin',
      '[@Formap]: https://github.com/Formap',
      '[@phillipj]: https://github.com/phillipj',
      ''
    ), 'should list usernames alphabetically')
  })

  t.test('issues', function (st) {
    st.plan(3)

    st.equal(sauce.dress('fixes #26'), longstr(
      'fixes [#26]',
      '',
      '[#26]: https://github.com/mochajs/mocha/issues/26',
      ''
    ), 'should enhance issues')

    st.equal(sauce.dress('fixes #26 and #27. fix lookup (#29)'), longstr(
      'fixes [#26] and [#27]. fix lookup ([#29])',
      '',
      '[#26]: https://github.com/mochajs/mocha/issues/26',
      '[#27]: https://github.com/mochajs/mocha/issues/27',
      '[#29]: https://github.com/mochajs/mocha/issues/29',
      ''
    ), 'should list issues in ascending order')

    st.equal(sauce.dress('#27 and #26 were fixed by @phillipj and @dasilvacontin'),
      longstr(
        '[#27] and [#26] were fixed by [@phillipj] and [@dasilvacontin]',
        '',
        '[#26]: https://github.com/mochajs/mocha/issues/26',
        '[#27]: https://github.com/mochajs/mocha/issues/27',
        '',
        '[@dasilvacontin]: https://github.com/dasilvacontin',
        '[@phillipj]: https://github.com/phillipj',
        ''
      ), 'should list issues first then usernames')
  })

  t.test('summary', function (st) {
    st.plan(6)

    var dressed = longstr(
      'fixes [#26]',
      '',
      '[#26]: https://github.com/mochajs/mocha/issues/26',
      ''
    )

    ;([
      'fixes #26\n',
      'fixes #26\n\n',
      'fixes #26\n\n\n',
      'fixes #26\t',
      'fixes #26\t\n \n\t'
    ]).forEach(function (str) {
      st.equal(
        sauce.dress(str),
        dressed,
        'should only have two newlines between end of text and link summary'
      )
    })

    st.equal(sauce.dress(longstr(
      'fixes #27 by @dasilvacontin',
      'fix thing [#26] by [@phillipj]',
      '',
      '[#26]: https://github.com/mochajs/mocha/issues/26',
      '',
      '[@phillipj]: https://github.com/phillipj',
      ''
    )), longstr(
      'fixes [#27] by [@dasilvacontin]',
      'fix thing [#26] by [@phillipj]',
      '',
      '[#26]: https://github.com/mochajs/mocha/issues/26',
      '[#27]: https://github.com/mochajs/mocha/issues/27',
      '',
      '[@dasilvacontin]: https://github.com/dasilvacontin',
      '[@phillipj]: https://github.com/phillipj',
      ''
    ), 'should merge with an existing summary')
  })

  t.test('config', function (st) {
    st.plan(5)

    var config = {}
    config.repo = 'https://github.com/dasilvacontin/gh-sauce'

    st.equal(sauce.dress('fixes #26', config), longstr(
      'fixes [#26]',
      '',
      '[#26]: https://github.com/dasilvacontin/gh-sauce/issues/26',
      ''
    ), 'should use `config.repo` for issue urls')

    config.repo = 'https://github.com/dasilvacontin/gh-sauce'
    st.equal(sauce.dress(longstr(
      'fixes [#27]',
      '',
      '[#27]: https://github.com/mochajs/mocha/issues/27',
      ''
    ), config), longstr(
      'fixes [#27]',
      '',
      '[#27]: https://github.com/dasilvacontin/gh-sauce/issues/27',
      ''
    ), 'must be able to overwrite urls')

    st.throws(function () {
      config.repo = 56
      sauce.dress('', config)
    }, 'should throw a TypeError for invalid config for `repo`')

    config = { safe: true }
    st.equal(sauce.dress(longstr(
      'fixes #27 by @phillipj',
      'fix thing [#26] by [@phillipj]',
      '',
      '[#26]: https://github.com/mochajs/mocha/issues/26',
      '',
      '[@phillipj]: https://twitter.com/phillipjohnsen',
      ''
    ), config), longstr(
      'fixes [#27] by [@phillipj]',
      'fix thing [#26] by [@phillipj]',
      '',
      '[#26]: https://github.com/mochajs/mocha/issues/26',
      '[#27]: https://github.com/mochajs/mocha/issues/27',
      '',
      '[@phillipj]: https://twitter.com/phillipjohnsen',
      ''
    ), 'should use `config.safe` for conserving existing urls')

    st.test('should throw an Error if couldn\'t figure out `repo`', function (st) {
      st.plan(1)
      process.chdir('test')
      delete require.cache[require.resolve('../')]
      sauce = require('../')

      st.throws(function missingPackage () {
        sauce.dress('w0l0l0')
      })

      process.chdir('..')
      delete require.cache[require.resolve('../')]
      sauce = require('../')
    })
  })
})
