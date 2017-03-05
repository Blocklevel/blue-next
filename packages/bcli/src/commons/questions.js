const force = {
  type: 'list',
  name: 'force',
  message: 'Would you like to override it?',
  default: false,
  choices: [
    {
      name: 'No, thanks!',
      value: false
    },
    {
      name: 'Yes, please!',
      value: true
    }
  ]
}

const vueHooks = {
  type: 'list',
  name: 'basic',
  message: 'Would you like some basic Vue hooks?',
  choices: [
    {
      name: 'No, thanks!',
      value: false
    },
    {
      name: 'Oh, yes!',
      value: true
    }
  ],
  default: false
}

module.exports = {
  force,
  vueHooks
}
