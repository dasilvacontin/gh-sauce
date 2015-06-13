#! /usr/bin/env node

var program = require('commander')
var pkg = require('../package.json')
var sauce = require('../lib/gh-sauce.js')

program
.version(pkg.version)
.usage('[options] <file ...>')
.parse(process.argv)

var files = program.args
if (files.length === 0) {
	files = ['README.md', 'CHANGELOG.md']
}

console.log('Dressing ' + files.join(', ') + ' with some gh-sauce...')

files.forEach(function (file) {
	sauce.dress(file)
})

console.log('Done! 🍧')
