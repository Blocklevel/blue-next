module.exports = function (vorpal) {
  return require('../commons/create-component')(vorpal, {
    type: 'page',
    command: 'page <name>',
    description: 'Create a new page'
  })
}
