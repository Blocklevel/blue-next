const fs = require('fs')

const filename = 'blue-error.log'
const dest = process.cwd()
const filePath = `${dest}/${filename}`

function clean () {
  if (!fs.existsSync(filePath)) {
    return
  }

  fs.unlink(filePath)
}

function write (error) {
  if (!error) {
    return
  }

  fs.writeFileSync(filePath, JSON.stringify(error.message || error, null, 2))
}

module.exports = {
  write,
  clean
}
