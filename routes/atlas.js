const express = require('express')
const router = express.Router()

const httpProxy =  require('http-proxy')
const atlas = httpProxy.createProxyServer({})

/*
router.get('/', function(req, res, next) {
  res.send('respond with a resource')
})
*/

router.all('*', function (req, res) {
//    console.log('Host:', req.header('Host'))
//    console.log(req)
//        console.log('http://192.168.1.8:80' + req.originalUrl)
    atlas.web(req, res, {
        target: 'http://192.168.1.8:80' + req.originalUrl,
//        forward:  'http://192.168.1.8:80' + req.originalUrl,
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
