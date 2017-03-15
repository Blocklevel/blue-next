const chai = require('chai')
const expect = chai.expect
const utils = require('../../../src/commons/utils')
const fs = require('fs')
const path = require('path')
const mock = require('mock-fs')

chai.use(require('chai-fs'))

const tmp = './tmp'

describe('utils.js', function () {
  describe('getGitUser', function () {
    it('should return a github user with name and email', function () {
      return utils.getGitUser().then(function (response) {
        expect(response).to.be.defined
        expect(response).to.have.property('name').and.to.be.a('string')
        expect(response).to.have.property('email').and.to.be.a('string')
      })
    })
  })

  describe('renameFilesFromDir', function () {
    it('should rename all files in the folder as "foo"', function () {
      mock({
        './tmp': {
          'index.css': ''
        }
      })

      expect('./tmp').to.be.a.directory().with.files(['index.css'])

      utils.renameFilesFromDir('./tmp', 'foo')

      expect('./tmp').to.be.a.directory().with.files(['foo.css'])
    })
  })

  describe('getEvents', function () {
    it('should return an array of objects', function () {
      const events = utils.getEvents('get, set')
      expect(events).to.be.a('array')
      expect(events.length).to.equal(2)
    })

    it('should return an item with property `value` as snake-uppercased string', function () {
      const events = utils.getEvents('get item')[0]

      expect(events).to.have.property('value').and.to.be.a('string')
      expect(events.value).to.equal('GET_ITEM')
    })
  })

  describe('isYarn', function () {
    it('should return a boolean', function () {
      return utils.isYarn().then((response) => {
        expect(response).to.be.a('boolean')
      })
    })
  })

  describe('getSemverFromMajor', function () {
    it('should return a semver string that matches the major version', function () {
      const versions = ['0.0.1', '0.0.2', '1.0.0-beta.2', '1.0.0', '2.0.3']
      const version = utils.getSemverFromMajor(versions, '1.0.0')

      expect(version).to.be.a('string')
      expect(version).to.equal('1.0.0')
    })

    it('should return the last available version if the major doesn\'t match', function () {
      const versions = ['0.0.1', '0.0.2', '0.0.8']
      const version = utils.getSemverFromMajor(versions, '2.0.0-beta.2')

      expect(version).to.be.a('string')
      expect(version).to.equal('0.0.8')
    })
  })
})
