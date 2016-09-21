'use strict'

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const plur = require('plur')
const logSymbols = require('log-symbols')
const codeFrame = require('babel-code-frame')

module.exports = results => {
  if (!results || !results.length) return ''

  let errorCount = 0
  let warningCount = 0

  const filesOutput = results.map(result => {
    if (!result.messages || !result.messages.length) return

    const fileContent = fs.readFileSync(result.filePath, 'utf8')

    const messagesOutput = result.messages.map(message => {
      const ruleId = chalk.dim(`(${message.ruleId})`)

      let symbol
      if (message.severity === 1) {
        symbol = logSymbols.warning
        warningCount++
      } else if (message.severity === 2) {
        symbol = logSymbols.error
        errorCount++
      }

      return [
        `  ${symbol} ${message.message} ${ruleId}`,
        `${codeFrame(fileContent, message.line, message.column, { highlightCode: true })}`
      ].join('\n')
    })

    const filename = chalk.underline(path.relative('.', result.filePath))

    return `  ${filename}\n\n${messagesOutput.join('\n\n')}`
  })

  let finalOutput = `${filesOutput.filter(s => s).join('\n\n\n')}\n\n`

  if (errorCount > 0) {
    finalOutput += `  ${chalk.red(`${errorCount}  ${plur('error', errorCount)}`)}\n`
  }

  if (warningCount > 0) {
    finalOutput += `  ${chalk.yellow(`${warningCount} ${plur('warning', warningCount)}`)}\n`
  }

  return (errorCount + warningCount) > 0 ? finalOutput : ''
}
