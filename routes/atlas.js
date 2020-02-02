const express = require('express')
const router = express.Router()

const httpProxy =  require('http-proxy')
const atlas = httpProxy.createProxyServer({})

const fs = require('fs')

let configAtlas = {}
if (fs.existsSync('configs/atlas.json')) {
    configAtlas = require('../configs/atlas.json')
}

/*
router.get('/', function(req, res, next) {
  res.send('respond with a resource')
})
*/

/*
// Prueba segun la pagina oficial
router.all('*', function (req, res) {
	console.log(req.headers)
	atlas.web(req, res, { target: 'http://localhost:80' })
})
*/

router.all('*', function (req, res) {
    atlas.web(req, res, {
        target: 'http://' + configAtlas.defaultRequest + req.originalUrl,
        ignorePath: true,
        autoRewrite: true, 
        headers: {
                Host: req.header('Host'),
                // Host: 'www.planetaguru.com.ar',
                'User-Agent':'GuruNodejs 2.0'
                }
        })

})

module.exports = router
