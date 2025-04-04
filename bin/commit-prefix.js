/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const { execSync } = require('child_process')

const fileToEdit = process.env.COMMIT_FILE
if (!fileToEdit) process.exit(0)

const files = execSync('git diff --name-only --cached', {
  encoding: 'utf8'
}).split('\n')

const found = new Set()
const dirs = {
  web: 0,
  admin: 0,
  packages: 1,
  '.github': 'ci'
}

files.forEach((file) => {
  const path = file.split('/')

  if (!(path[0] in dirs)) return
  // @ts-expect-error path[0] is a string
  const rule = dirs[path[0]]

  if (typeof rule === 'number' && path.length > rule) {
    found.add(path[rule])
  }

  if (typeof rule === 'string') {
    found.add(rule)
  }
})

if (!found || !found.size) process.exit(0)

const prefix = Array.from(found).sort().join(' ').toUpperCase()
const msg = fs.readFileSync(fileToEdit, 'utf8')
if (!msg.startsWith('[') && !msg.startsWith('fixup!')) {
  fs.writeFileSync(fileToEdit, `[${prefix}] ${msg}`)
}
