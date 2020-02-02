const express = require('express')
const router = express.Router()

const httpProxy =  require('http-proxy')
const atlas = httpProxy.createProxyServer({})

const fs = require('fs')

let config = {}
if (fs.existsSync('configs/toSraPOC.json')) {
    config = require('../configs/toSraPOC.json')
}


atlas.on('proxyReq', function(proxyReq, req, res, options){
	if ((req.method === 'POST' || req.method === 'PUT') && req.body) {
		proxyReq.write(JSON.stringify(req.body))
	}
})

router.all('*', function (req, res) {

	if (req.originalUrl === '/srapoc') {
		res.redirect('/srapoc/')
		return
	}

//	console.log(req)
//	console.log('req.originalUrl:', req.originalUrl)
//	console.log('Reenviar: http://' + config.srapoc + req.url)

    atlas.web(req, res, {
        target: 'http://' + config.srapoc + req.url,
        ignorePath: true,
        autoRewrite: false,
        headers: {
                Host: req.header('Host'),
                'User-Agent':'Atlas 2.0'
                }
        })

})

module.exports = router
