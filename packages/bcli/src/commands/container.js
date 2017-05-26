module.exports = function (vorpal) {
  return require('../commons/create-component')(vorpal, {
    type: 'container',
    command: 'container <name>',
    description: 'Create a new container'
  })
}
