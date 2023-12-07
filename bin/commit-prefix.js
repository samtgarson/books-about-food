const fs = require('fs')
const { execSync } = require('child_process')

const fileToEdit = process.env.COMMIT_FILE
if (!fileToEdit) process.exit(0)

const files = execSync('git diff --name-only --cached', {
  encoding: 'utf8'
}).split('\n')

const found = new Set()
const dirs = ['web', 'admin']

files.forEach((file) => {
  const path = file.split('/')
  if (dirs.some((dir) => path[0] === dir)) {
    found.add(path[0])
  }

  if (path[0] === 'packages') {
    found.add(path[1])
  }
})

if (!found || !found.size) process.exit(0)

const prefix = Array.from(found).join(', ').toUpperCase()
const msg = fs.readFileSync(fileToEdit, 'utf8')
if (!msg.startsWith('[')) {
  fs.writeFileSync(fileToEdit, `[${prefix}] ${msg}`)
}
