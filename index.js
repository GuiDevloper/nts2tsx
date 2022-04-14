#! /usr/bin/env node
const fs = require('fs')
const path = require('path')
const cmds = process.argv.slice(2)

const Extensions = ['.nts', '.tsx']
let oldExt = Extensions[0]
let newExt = Extensions[1]
if (cmds.includes('--invert')) {
  oldExt = Extensions[1]
  newExt = Extensions[0]
  cmds.splice(cmds.indexOf('--invert'), 1)
}

const renamedFiles = []

function renameAll(dirName) {
  const dir = fs.readdirSync(dirName, { withFileTypes: true })
  dir.forEach(d => {
    const dirPath = path.join(dirName, d.name)
    if (
      d.name === 'node_modules' ||
      d.name === 'webpack.config.js' ||
      d.name.startsWith('.')
    ) return

    if (d.isDirectory()) {
      return renameAll(dirPath)
    }

    if (d.name.endsWith(oldExt)) {
      const newPath = dirPath.replace(new RegExp(`\\${oldExt}$`), newExt)
      renamedFiles.push(path.relative(process.cwd(), newPath))
      fs.renameSync(dirPath, newPath)
    }
  })
}

function run() {
  renameAll(process.cwd())
  if (renamedFiles.length === 0) {
    return console.log('No files changed!')
  }
}

run()