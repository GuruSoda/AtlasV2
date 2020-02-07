const express = require('express');
const router = express.Router();
const path = require('path')
const catalogador = require('../models/catalogadorModel')

const catalogadorws = new catalogador()
catalogadorws.open()

/*
router.use('/', express.static(path.join(__dirname, 'public_catalogador')))

router.get('/', function (req, res, next) {
    console.log('Enviando!:', req.path)
    res.sendFile(path.join(__dirname, req.path));
})
*/
// curl -X POST -H "Content-Type: application/json" -d '{"word":"ghost"}' http://localhost:3000/catalogador/search
router.post('/search', function(req, res, next) {

    const str = req.body.word
    const nostr = req.body.noword

    catalogadorws.search(str, nostr).then(function(nombres) {
//        console.log(JSON.stringify(nombres))
//        console.log(nombres)
//        console.log('Total items encontrados:', nombres.length)
        res.json(nombres)
    }).catch(function(error) {
        res.json([])
        console.log(error)
    })
});

router.get('/version', function(req, res, next) {
    res.json({version: catalogadorws.version()})
})

router.get('/catalogos', function(req, res, next) {
    catalogadorws.catalogos().then(function(data) {
        res.json(data)
    }).catch(function(error){
        res.json({})
        console.log(error)
    })
})

module.exports = router
