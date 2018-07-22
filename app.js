const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const routes = require('./routes')

require('dotenv').config()
const PORT = process.env.PORT

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(routes)
app.use(cors())

// require('./app/controllers/index')(app)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log("Connected to port: " + PORT)
})

module.exports = app
