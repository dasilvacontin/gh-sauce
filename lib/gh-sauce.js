/*
 * gh-sauce
 * https://github.com/dasilvacontin/gh-sauce
 *
 * Copyright (c) 2015 David da Silva Contín
 * Licensed under the MIT license.
 */

'use strict'

var _ = require('lodash')

module.exports.config = {
  repo: 'REPO_URL',
  safe: false
}

try {
  var cwdPkg = require(process.cwd() + '/package.json')
  module.exports.config.repo = cwdPkg.homepage
} catch (err) {}

module.exports.dress = function (text, config) {
  if (typeof text !== 'string') {
    throw new TypeError('Expected `text` (arg #1) to be a string')
  }

  config = typeof config === 'object' && config || {}
  config = _.assign(_.clone(module.exports.config), config)

  var issues = {}
  var users = {}

  var dressed = text.replace(/(^@|[^\[]@)([a-z\d]+)/ig, function (match, at, username) {
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

  if (_.size(issues) + _.size(users) === 0) {
    return text
  }

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
  var sortedUsernames = _.keys(users).sort()

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
