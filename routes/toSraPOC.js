const express = require('express')
const router = express.Router()

const httpProxy =  require('http-proxy')
const atlas = httpProxy.createProxyServer({})

const fs = require('fs')

let config = {}
if (fs.existsSync('configs/toSraPOC.json')) {
    config = require('../configs/toSraPOC.json')
}

router.all('*', function (req, res) {
  //  console.log(req.url)

    console.log('Reenviar: http://' + config.srapoc + req.url)

    atlas.web(req, res, {
        target: 'http://' + config.srapoc + req.url,
        forward: 'http://' + config.srapoc + req.url,
        ignorePath: true,
        autoRewrite: false,
        headers: {
                Host: req.header('Host'),
                // Host: 'www.planetaguru.com.ar',
                'User-Agent':'GuruNodejs 2.0'
                }
        })

})

module.exports = router
