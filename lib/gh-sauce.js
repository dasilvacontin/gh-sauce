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

  var dressed = text.replace(/@[a-z\d]+/ig, function (username) {
    users[username] = true
    return '[' + username + ']'
  }).replace(/(^#|\s#)(\d+)/g, function (match, hash, issue) {
    /**
     * for 'fix #5':
     * match => ' #5'
     * hash => ' #'
     * issue => '5'
     */
    issues[issue] = true
    return hash.slice(0, -1) + '[#' + issue + ']'
  })

  dressed += '\n\n'

  // [10, 2, 1].sort() => [ 1, 10, 2 ] ...
  var sortedIssues = _.keys(issues).sort(function (a, b) {
    return a - b
  })
  if (sortedIssues.length > 0) {
    _.forEach(sortedIssues, function (issue) {
      dressed += '[#' + issue + ']: '
      dressed += 'https://github.com/mochajs/mocha/issues/' + issue + '\n'
    })
    dressed += '\n'
  }

  var sortedUsernames = _.keys(users).sort()
  if (sortedUsernames.length > 0) {
    _.forEach(sortedUsernames, function (username) {
      dressed += '[' + username + ']: '
      dressed += 'https://github.com/' + username.slice(1) + '\n'
    })
    dressed += '\n'
  }

  return dressed
}
