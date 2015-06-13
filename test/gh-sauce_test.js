'use strict'

/* globals describe, it */

var ghSauce = require('../')
require('should')

describe('ghSauce', function () {

  it('should be awesome', function () {
    ghSauce().should.equal('awesome')
  })

})
