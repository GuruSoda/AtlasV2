const express = require('express');
const router = express.Router();

const catalogador = require('../models/catalogadorModel')

const catalogadorws = new catalogador()

catalogadorws.open('databases/catalogo.bd')

// curl -X POST -H "Content-Type: application/json" -d '{"word":"ghost"}' http://localhost:3000/catalogador/search
router.post('/search', function(req, res, next) {
    var str = req.body.word;

    catalogadorws.search(str).then(function(nombres) {
        console.log(JSON.stringify(nombres))
        res.json(nombres)
    }).catch(function(error) {
        res.json([])
        console.log(error)
    })
});

module.exports = router
