const express = require('express')
const database = require('./database')
const trackRoute = require('./routes/tracks.routes')
const app = express()
const morgan = require('morgan')
app.use(express.urlencoded({
    extended: true
  }))
app.use(morgan('dev'))
app.use('/tracks',trackRoute)

app.listen(3000,()=>console.log('Server started on port 3000'))