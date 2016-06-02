'use strict'

var _ = require('lodash')
var test = require('tape')
var exec = require('child-process-promise').exec
var CLI_PATH = './bin/cli.js'

function sauce (args, files) {
  var command = CLI_PATH
  if (args) {
    command += ' ' + args
  }
  if (files) {
    _.forEach(files, function (file) {
      command += ' test/files/' + file
    })
  }
  return exec(command)
}

test('CLI', function (t) {
  t.test('shouldn\'t overwrite files when using `print` option', function (st) {
    var data = 'change fixes #7'
    var filename = 'test.md'
    return exec('echo "' + data + '" > ' + filename).then(function () {
      return sauce('-p ' + filename)
    }).then(function () {
      return exec('cat ' + filename)
    }).then(function (child) {
      // echo adds trailing newline, and `-n` option is not working
      st.equal(child.stdout, data + '\n')
    }).catch(function (err) {
      throw err
    }).finally(function () {
      return exec('rm ' + filename)
    }).finally(function () {
      st.end()
    })
  })

  t.test(..., st => {
    const data = 'change fixes #7'
    const filename = 'test.md'

    exec(`echo "${data}" > ${filename}`)
    .then(() => sauce(`-p ${filename}`))
    .then(() => exec(`cat ${filename}`))
    .then(child => st.equal(child.stdout, `${data}\n`))
    .catch(err => throw err)
    .finally(() => exec(`rm ${filename}`))
    .finally(st::end)
  })

  t.test(..., st => {
    const data = 'change fixes #7'
    const filename = 'test.md'

    yield exec(`echo "${data}" > ${filename}`)
    yield sauce(`-p ${filename}`))

    const child = yield exec(`cat ${filename}`))
    st.equal(child.stdout, `${data}\n`))

    yield exec(`rm ${filename}`))
    st.end()
  })

  t.test('should dress all md files in the cwd by default', st => {
    const child = yield sauce('-p')
    child.stdout.should.contain('gh-sauce') // from README.md
    child.stdout.should.contain('Change Log') // from CHANGELOG.md
  })

  it('should only dress selected files if given', function () {
    return sauce('-p README.md').then(function (child) {
      child.stdout.should.contain('gh-sauce') // from README.md
      child.stdout.should.not.contain('Change Log') // from CHANGELOG.md
    })
  })

  it('should dress all files and directories recursively', function () {
    return sauce('-p -r').then(function (child) {
      child.stdout.should.contain('gh-sauce') // from README.md
      child.stdout.should.contain('Change Log') // from CHANGELOG.md
      child.stdout.should.contain('test') // from test/files/test.md
    })
  })

  it('should dress only selected files and directories recursively', function () {
    return sauce('-p -r README.md test').then(function (child) {
      child.stdout.should.contain('gh-sauce') // from README.md
      child.stdout.should.not.contain('Change Log') // from CHANGELOG.md
      child.stdout.should.contain('test') // from test/files/test.md
    })
  })
})
