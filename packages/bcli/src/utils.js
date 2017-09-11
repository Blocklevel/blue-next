const execa = require('execa')

/**
 * It runs all commands with Yarn but it fallsback to Npm if Yarn is not installed
 * or maybe because Yarn is not globally accessable
 * @param  {Array<String>} cmds          list of commands
 * @param  {Array<String>} fallsbackCmds list of fallback commands
 * @return {Promise}
 */
function yarnWithFallback (cmds, fallsbackCmds) {
  return execa('yarn', cmds).catch(() => execa('npm', fallsbackCmds || cmds))
}

module.exports = {
  yarnWithFallback
}
