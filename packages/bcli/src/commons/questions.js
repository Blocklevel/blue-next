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
    },
  ],
  default: false
}

const fileLocation = {
  when: function () {
    // need to call it like this because of scope issue
    return !require('./utils').hasAppConfig()
  },
  type: 'list',
  name: 'location',
  message: 'Where should I drop it?',
  choices: [
    {
      name: 'Make it for Blue',
      value: 'blue'
    },
    {
      name: 'Drop it here!',
      value: 'none'
    }
  ]
}

module.exports = {
  force,
  vueHooks,
  fileLocation
}
