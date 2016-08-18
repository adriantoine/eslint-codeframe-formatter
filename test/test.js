const path = require('path')
const fs = require('fs')
const spawn = require('child_process').spawnSync

const eslintPath = path.join(__dirname, '../node_modules/.bin/eslint')
const formatterPath = path.join(__dirname, '../index.js')

const test = require('ava')

test('should show correct output for basic file', t => {
  const filePath = path.join(__dirname, '/fixtures/file.js')
  const file2Path = path.join(__dirname, '/fixtures/file2.js')
  const expected = fs.readFileSync(path.join(__dirname, '/fixtures/output.txt'), 'utf8')

  const eslintOuput = spawn(eslintPath, ['--format=' + formatterPath, filePath, file2Path], { encoding: 'utf8' })

  t.is(eslintOuput.stdout, expected)
})
