import express from 'express' // eslint-disable-line import/no-extraneous-dependencies
import server from './index'

const app = express()

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001

app.use(server)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
