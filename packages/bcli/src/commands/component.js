module.exports = function (vorpal) {
  return require('../commons/create-component')(vorpal, {
    type: 'component',
    command: 'component <name>',
    description: 'Create a new component'
  })
}
