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
    console.log('Host:', req.header('Host'))

    atlas.web(req, res, {
        target: 'http://192.168.1.8:80', 
        autoRewrite: true, 
        headers: {
                // Host: req.header('Host'),
                Host: 'planetaguru.com.ar',
                'User-Agent':'GuruNodejs 1.0'
                }
        })

})

module.exports = router
