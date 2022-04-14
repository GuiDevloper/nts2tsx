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

const saveFile = path.join(process.cwd(), './nts2tsx-save.txt')
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

function getStoredFiles() {
  return (
    fs.existsSync(saveFile)
    ? fs.readFileSync(saveFile, { encoding: 'utf-8' }) + '\n'
    : ''
  )
}

function undoRename() {
  const storedFiles = getStoredFiles().split('\n')
  storedFiles.pop()
  if (storedFiles.length === 0) {
    return console.log('No files to be restored!')
  }
  storedFiles.forEach(file => {
    fs.renameSync(file, file.replace(new RegExp(`\\${newExt}$`), oldExt))
  })
  console.log(`${storedFiles.length} files restored!`)
  fs.unlinkSync(saveFile)
  console.log('SaveFile erased!')
}

function storeUpdated() {
  if (renamedFiles.length === 0) return
  const oldUpdated = getStoredFiles()
  fs.writeFileSync(saveFile, oldUpdated + renamedFiles.join('\n'))
  console.log(`${renamedFiles.length} changed files saved!`)
}

function run() {
  if (cmds.includes('--restore')) {
    cmds.splice(cmds.indexOf('--restore'), 1)
    return undoRename()
  }
  renameAll(process.cwd())
  if (renamedFiles.length === 0) {
    return console.log('No files changed!')
  }
  storeUpdated()
}

run()