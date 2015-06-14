#! /usr/bin/env node

var fs = require('fs')
var program = require('commander')

var pkg = require('../package.json')
var sauce = require('../lib/gh-sauce.js')

program
.version(pkg.version)
.usage('[options] <file ...>')
.option('-s, --safe', 'Safe mode, doesn\'t overwrite existing urls')
.parse(process.argv)

var files = program.args
if (files.length === 0) {
  files = ['CHANGELOG.md']
}

var config = {}
if (program.safe) {
  config.safe = program.safe
}

console.log('# Dressing ' + files.join(', ') + ' with some gh-sauce...\n')

function doneDressing (msg) {
  console.log(msg)
  --files.length
  if (files.length === 0) {
    console.log('\nDone! 🍧')
  }
}

files.forEach(function (file) {
  fs.readFile(file, function (err, data) {
    if (err) {
      if (err.code === 'ENOENT') {
        doneDressing('- [ ] "' + file + '" doesn\'t exist')
      } else {
        doneDressing('- [ ] "' + file + '" error, code :' + err.code)
      }
      return
    }
    var dressed = sauce.dress(data.toString(), config)
    fs.writeFile(file, dressed, function (err) {
      if (err) {
        throw err
      }
      doneDressing('- [x] "' + file + '" was dressed with gh-sauce')
    })
  })
})
