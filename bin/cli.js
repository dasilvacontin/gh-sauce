#! /usr/bin/env node

var _ = require('lodash')
var Promise = require('bluebird')
var program = require('commander')
var fs = Promise.promisifyAll(require('fs'))

var pkg = require('../package.json')
var sauce = require('../lib/gh-sauce.js')

program
.version(pkg.version)
.usage('[options] <file ...>')
.option('-s, --safe', 'safe mode, doesn\'t overwrite existing urls')
.option('-r, --repo <repo URL>', 'provide default repo URL for issues')
.option('-p, --print', 'print out the dressed files')
.parse(process.argv)

var files = program.args
if (files.length === 0) {
  files = _.filter(fs.readdirSync('.'), function (file) {
    return _.endsWith(file, '.md')
  })
}

var config = {}
if (program.safe) {
  config.safe = program.safe
}
if (program.repo) {
  config.repo = program.repo
}

var print = program.print

if (!print) console.log('# Dressing ' + files.join(', ') + ' with some gh-sauce...\n')

function doneDressing (msg) {
  if (!print) console.log(msg)
  --files.length
  if (files.length === 0) {
    if (!print) console.log('\nDone! 🍧')
  }
}

_.forEach(files, function (file) {
  fs.readFileAsync(file).then(function (data) {
    var dressed = sauce.dress(data.toString(), config)
    if (print) console.log(dressed)
    else return fs.writeFileAsync(file, dressed)
  }).then(function () {
    doneDressing('- [x] "' + file + '" was dressed with gh-sauce')
  }).catch(function (err) {
    switch (err.code) {
      case 'ENOENT':
        doneDressing('- [ ] "' + file + '" doesn\'t exist')
        break
      default:
        doneDressing('- [ ] "' + file + '" error, code :' + err.code)
        break
    }
  })
})
