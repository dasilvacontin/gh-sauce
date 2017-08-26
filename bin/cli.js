#! /usr/bin/env node

var _ = require('lodash')
var Promise = require('bluebird')
var program = require('commander')
var fs = Promise.promisifyAll(require('fs'))
var rfs = require('fs-readdir-recursive')

var pkg = require('../package.json')
var sauce = require('../lib/gh-sauce.js')

program
.version(pkg.version)
.usage('[options] <file ...>')
.option('-s, --safe', 'safe mode, doesn\'t overwrite existing urls')
.option('--repo <repo URL>', 'provide default repo URL for issues')
.option('-r, --recursive', 'dresses files recursively')
.option('-p, --print', 'print out the dressed files')
.parse(process.argv)

function mdFilter (file) {
  return _.endsWith(file, '.md')
}

function getFilesRecursively (files, rootFile) {
  if (fs.lstatSync(rootFile).isDirectory()) {
    var nestedFiles = rfs(rootFile, function (file) {
      return file !== 'node_modules'
    })
    nestedFiles = _.filter(nestedFiles, mdFilter)
    nestedFiles = _.map(nestedFiles, function (file) {
      return rootFile + '/' + file
    })
    return files.concat(nestedFiles)
  } else {
    return files.concat(rootFile)
  }
}

var files = program.args
if (program.recursive) {
  if (files.length === 0) {
    files = getFilesRecursively([], '.')
  } else {
    files = _.reduce(program.args, getFilesRecursively, [])
  }
} else {
  if (files.length === 0) {
    files = _.filter(fs.readdirSync('.'), mdFilter)
  }
}

var config = {}
if (program.safe) {
  config.safe = program.safe
}

var print = config.print = !program.print

if (program.repo) {
  config.repo = program.repo
} else {
  var repoGuess

  try {
    var repoURL = String(spawnSync('git', ['remote', 'get-url', 'origin']).stdout).trim()
    if (/^https:\/\/github\.com/.test(repoURL)) {
      // HTTPS
      config.repo = repoURL.replace(/\.git$/, '')
    } else if (/^git@github\.com:(.+)\.git$/.test(repoURL)) {
      config.repo = repoURL.match(/^git@github\.com:(.+)\.git$/)[1]
    }
    repoGuess = 'the git `origin` remote'
  } catch (err) {}

  try {
    var cwdPkg = require(process.cwd() + '/package.json')
    config.repo = cwdPkg.homepage
    repoGuess = 'package.json'
  } catch (err) {}

  if (print && config.repo) {
    console.log('# Guessing repo name: ' + config.repo.replace(/^https:\/\/github\.com\//, ''))
    if (repoGuess) console.log('> Guessed from ' + repoGuess)
    console.log('> Use `--repo` to customize')
  }
}
if (print) console.log('# Dressing ' + files.join(', ') + ' with some gh-sauce...\n')

function doneDressing (msg) {
  if (print) console.log(msg)
  --files.length
  if (files.length === 0) {
    if (print) console.log('\nDone! 🍧')
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
        doneDressing('- [ ] "' + file + '" errored, code: ' + (err.code || '<unknown>') + '\n' + err)
        break

    }
  })
})
