const ora = require('ora')

let currentStep

module.exports = (text, done) => {
  if (currentStep) {
    if (done) {
      currentStep.succeed(text)
      currentStep = null
    } else {
      currentStep.succeed()
    }
  }

  if (!done) {
    currentStep = ora(text).start()
  }
}
