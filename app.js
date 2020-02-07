const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const serveIndex = require('serve-index')

//const indexRouter = require('./routes/index')
const catalogadorRouter = require('./routes/catalogador')
const atlasRouter = require('./routes/atlas')
const toSraPOC = require('./routes/toSraPOC')

const app = express()

// Configuracion Atlas
let configAtlas = {}
if (fs.existsSync('./configs/atlas.json')) {
    configAtlas = require('./configs/atlas.json')
}

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

let accessLogStream = fs.createWriteStream(path.join(__dirname, './logs/access.log'), { flags: 'a' })
app.use(logger('dev', {stream: accessLogStream}))

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// app.use('/', indexRouter)

app.use('/catalogador', express.static(path.join(__dirname, 'public_catalogador')))
app.use('/catalogador', catalogadorRouter)

app.use('/srapoc', toSraPOC)

app.use('/fs', express.static('/Musica', {etag: false}), serveIndex('/Musica', {hidden: true, icons: true, view: 'details' }))

// si llego hasta aqui se manda a Atlas V1 (C++)
if (configAtlas.defaultRequest)
  app.use('*', atlasRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
