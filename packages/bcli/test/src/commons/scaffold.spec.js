const chai = require('chai')
const expect = chai.expect
const scaffold = require('../../../src/commons/scaffold')
const blueTemplates = require('blue-templates')
const fs = require('fs')
const path = require('path')
const mock = require('mock-fs')
const _ = require('lodash')
const _utils = require('../../utils')

chai.use(require('chai-fs'))

describe('scaffold.js', function () {

  describe('project', function () {
    const options = {
      name: 'project',
      dest: './tmp',
      template: './blue-template',
      cssTemplate: './css-template',
      templateCssFolder: blueTemplates.getStylePath('./tmp')
    }

    beforeEach(function (done) {
      mock({
        'tmp': {},
        'blue-template': _utils.mockFolder(blueTemplates.getBlue()),
        'css-template': _utils.mockFolder(blueTemplates.getPreProcessor('postcss'))
      })

      scaffold.project(options).then(done)
    })

    afterEach(function () {
      mock.restore()
    })

    it('should create an src folder', function () {
      expect('tmp/src').to.be.a.directory().and.not.empty
    })

    it('should add a blue.config.js file in the root of the project', function () {
      expect('tmp').to.be.a.directory().and.include.files(['blue.config.js'])
    })

    it('should drop the css template in src/asset/style folder', function () {
      expect('tmp').to.be.a.directory().with.deep.subDirs(['src', 'src/asset', 'src/asset/style'])
      expect('tmp/src/asset/style').to.be.a.directory().and.include.files(['postcss.config.js'])
    })
  })


  describe('component', function () {
    beforeEach(function () {
      mock({
        'tmp': {},
        'component-template': _utils.mockFolder(blueTemplates.getComponent())
      })
    })

    afterEach(function () {
      mock.restore()
    })

    it('should generate a component', function () {
      return scaffold.component({
        name: 'foo',
        type: 'component',
        dest: 'tmp',
        template: 'component-template'
      }).then((response) => {
        expect('tmp').to.be.a.directory().and.include.files(['foo.js', 'foo.vue', 'foo.css'])
      })
    })

    it('should generate a container component', function () {
      return scaffold.component({
        name: 'foo',
        type: 'container',
        dest: 'tmp',
        template: 'component-template'
      }).then((response) => {
        expect('tmp').to.be.a.directory().and.include.files(['foo.js', 'foo.vue', 'foo.css'])
      })
    })

    it('should generate a page component', function () {
      return scaffold.component({
        name: 'foo',
        type: 'page',
        dest: 'tmp',
        template: 'component-template'
      }).then((response) => {
        expect('tmp').to.be.a.directory().and.include.files(['foo.js', 'foo.vue', 'foo.css'])
      })
    })
  })

  describe('storeModule', function () {
    beforeEach(function () {
      mock({
        'tmp': {},
        'store-template': _utils.mockFolder(blueTemplates.getStoreModule())
      })
    })

    afterEach(function () {
      mock.restore()
    })

    it('should create a store module', function () {
      return scaffold.storeModule({
        name: 'foo',
        dest: 'tmp',
        template: 'store-template'
      }).then((response) => {
        expect('tmp').to.be.a.directory().and.include.files([
          'actions.js',
          'mutations.js',
          'events.js',
          'index.js',
          'state.js'
        ])
      })
    })
  })
})
