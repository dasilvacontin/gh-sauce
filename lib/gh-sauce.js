/*
 * gh-sauce
 * https://github.com/dasilvacontin/gh-sauce
 *
 * Copyright (c) 2015 David da Silva Contín
 * Licensed under the MIT license.
 */

'use strict'

module.exports.dress = function (text) {
  if (typeof text !== 'string') {
    throw new TypeError('Expected `text` (arg #1) to be a string')
  }
}
