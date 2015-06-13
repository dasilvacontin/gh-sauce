/*
 * gh-sauce
 * https://github.com/dasilvacontin/gh-sauce
 *
 * Copyright (c) 2015 David da Silva Contín
 * Licensed under the MIT license.
 */

'use strict'

var _ = require('lodash')

module.exports.dress = function (text) {
  if (typeof text !== 'string') {
    throw new TypeError('Expected `text` (arg #1) to be a string')
  }

  var issues = {}
  var users = {}

    users[username] = null
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

  // [10, 2, 1].sort() => [ 1, 10, 2 ] ...
  var sortedIssues = _.keys(issues).sort(function (a, b) {
    return a - b
  })
  var sortedUsernames = _.keys(users).sort()

  if (sortedIssues.length + sortedUsernames.length === 0) {
    return dressed
  }

  dressed = _.trimRight(dressed)
  dressed += '\n\n'

  if (sortedIssues.length > 0) {
    _.forEach(sortedIssues, function (issue) {
      dressed += '[#' + issue + ']: '
      if (issues[issue] === null) {
        dressed += 'https://github.com/mochajs/mocha/issues/' + issue
      } else {
        dressed += issues[issue]
      }
      dressed += '\n'
    })
    dressed += '\n'
  }

  if (sortedUsernames.length > 0) {
    _.forEach(sortedUsernames, function (username) {
      if (users[username] === null) {
        dressed += 'https://github.com/' + username
      } else {
        dressed += users[username]
      }
      dressed += '\n'
    })
    dressed += '\n'
  }

  return dressed
}
