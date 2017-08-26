/*
 * gh-sauce
 * https://github.com/dasilvacontin/gh-sauce
 *
 * Copyright (c) 2015 David da Silva Contín
 * Licensed under the MIT license.
 */

'use strict'

var _ = require('lodash')
var spawnSync = require('child_process').spawnSync

module.exports.config = {
  repo: null,
  safe: false
}

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
  module.exports.config.repo = cwdPkg.homepage
  repoGuess = 'package.json'
} catch (err) {}

module.exports.dress = function (text, config) {
  if (typeof text !== 'string') {
    throw new TypeError('Expected `text` (arg #1) to be a string in sauce#dress(text, config)')
  }

  config = typeof config === 'object' && config || {}
  var hadRepo = !!config.repo
  config = _.assign(_.clone(module.exports.config), config)

  if (config.repo === null) {
    throw new Error('Can\'t figure out repo and it was not provided')
  } else if (typeof config.repo !== 'string') {
    throw new TypeError('Invalid config for `repo`: ' + require('util').inspect(config.repo))
  } else if (!/^https:\/\/github\.com/.test(config.repo)) {
    config.repo = 'https://github.com/' + config.repo
  }

  if (config.print && !hadRepo) {
    console.log('# Guessing repo name: ' + config.repo.replace(/^https:\/\/github\.com\//, ''))
    if (repoGuess) console.log('> Guessed from ' + repoGuess)
    console.log('> Use `--repo` to customize')
  }

  var issues = {}
  var users = {}

  var dressed = text.replace(/(^@|\s+@)([a-z\d]+)/ig, function (match, at, username) {
    /**
     * for '(@dasilvacontin)':
     * match => '(@dasilvacontin'
     * at => '(@'
     * username => 'dasilvacontin'
     */
    users[username] = null
    return at.slice(0, -1) + '[@' + username + ']'
  }).replace(/(^#|\s#|\(#)(\d+)/g, function (match, hash, issue) {
    /**
     * for 'fix #5':
     * match => ' #5'
     * hash => ' #'
     * issue => '5'
     */
    issues[issue] = null
    return hash.slice(0, -1) + '[#' + issue + ']'
  })

  dressed = _.trimRight(dressed)
  dressed = dressed.split('\n')

  // parse/consume existing summary, if there's any
  while (dressed.length > 0) {
    var line = _.last(dressed)
    line = _.trim(line)
    var match = /\[(#|@)([a-z\d]+)\]: (.+)/ig.exec(line)
    if (line.length > 0 && !match) {
      break
    }
    if (match) {
      (match[1] === '@' ? users : issues)[match[2]] = _.trim(match[3])
    }
    dressed.pop()
  }
  dressed = dressed.join('\n')

  // [10, 2, 1].sort() => [ 1, 10, 2 ] ...
  var sortedIssues = _.keys(issues).sort(function (a, b) {
    return a - b
  })
  var sortedUsernames = _.keys(users).sort(function (a, b) {
    a = a.toLowerCase()
    b = b.toLowerCase()
    return a < b ? -1 : a > b ? 1 : 0
  })

  dressed += '\n\n'

  if (sortedIssues.length > 0) {
    _.forEach(sortedIssues, function (issue) {
      dressed += '[#' + issue + ']: '
      if (issues[issue] === null || !config.safe) {
        dressed += config.repo + '/issues/' + issue
      } else {
        dressed += issues[issue]
      }
      dressed += '\n'
    })
  }

  if (sortedUsernames.length > 0) {
    if (sortedIssues.length > 0) {
      dressed += '\n'
    }
    _.forEach(sortedUsernames, function (username) {
      dressed += '[@' + username + ']: '
      if (users[username] === null || !config.safe) {
        dressed += 'https://github.com/' + username
      } else {
        dressed += users[username]
      }
      dressed += '\n'
    })
  }

  return dressed
}
