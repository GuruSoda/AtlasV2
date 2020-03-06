const express = require('express');
const router = express.Router();
const path = require('path')
const catalogador = require('../models/catalogadorModel')
const serveIndex = require('serve-index')
const Busboy = require('busboy')
const fileUpload = require('express-fileupload')
const fs = require('fs')

const catalogadorws = new catalogador()
catalogadorws.open()

router.use(fileUpload({
    useTempFiles : true,
    tempFileDir : 'uploads/'
}))

router.use('/cosas', express.static('/Cosas', {etag: false}), serveIndex('/Cosas', {hidden: true, icons: true, view: 'details' }))

router.use('/chicas', express.static('/mnt/.Chicas', {etag: false}), serveIndex('/mnt/.Chicas', {hidden: true, icons: true, view: 'details' }))

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

router.get('/id/:id', function(req, res, next) {
    catalogadorws.id(req.params.id).then(function(data) {
        data.ruta = data.dir_etiqueta + data.directorio + data.archivo 
        res.json(data)
    }).catch(function(error){
        res.json({})
        console.log(error)
    })
})

router.get('/subir', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.write('<form action="/catalogador/upload" method="post" enctype="multipart/form-data">')
    res.write('<input type="file" name="file01"><br>')
    res.write('<input type="file" name="file02"><br>')
    res.write('<input type="text" name="textfield"><br>')
    res.write('<input type="submit">')
    res.write('</form>')
    return res.end()
})

/*
router.post('/upload', function (req, res) {
    var busboy = new Busboy({ headers: req.headers })

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
 
        console.log('fieldname:', fieldname)
        console.log('filename', filename)
        console.log('encoding', encoding)
        console.log('mimetype', mimetype)

      var saveTo = path.join(__dirname, '../uploads/' + filename)
      file.pipe(fs.createWriteStream(saveTo))
    });
 
    busboy.on('finish', function() {
      res.writeHead(200, { 'Connection': 'close' });
      res.end("That's all folks!");
    });
     
    return req.pipe(busboy)
});
*/

router.post('/upload', function(req, res) {
    console.log(req.files)
    res.json(req.files)
});

module.exports = router
