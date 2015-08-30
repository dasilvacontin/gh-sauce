'use strict'

/* globals describe, it */

var _ = require('lodash')
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

describe('CLI', function () {
  it('shouldn\'t overwrite files when using `print` option', function () {
    var data = 'change fixes #7'
    var filename = 'test.md'
    return exec('echo "' + data + '" > ' + filename).then(function () {
      return sauce('-p ' + filename)
    }).then(function () {
      return exec('cat ' + filename)
    }).then(function (child) {
      // echo adds trailing newline, and `-n` option is not working
      child.stdout.should.equal(data + '\n')
    }).catch(function (err) {
      throw err
    }).finally(function () {
      return exec('rm ' + filename)
    })
  })

  it('should dress all md files in the cwd by default', function () {
    return sauce('-p').then(function (child) {
      child.stdout.should.contain('gh-sauce') // from README.md
      child.stdout.should.contain('Change Log') // from CHANGELOG.md
    })
  })

  it('should only dress selected files if given', function () {
    return sauce('-p README.md').then(function (child) {
      child.stdout.should.contain('gh-sauce') // from README.md
      child.stdout.should.not.contain('Change Log') // from CHANGELOG.md
    })
  })
})

