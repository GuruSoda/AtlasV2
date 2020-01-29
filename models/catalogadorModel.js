const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')

const configuracion = 'configs/catalogador.json'

let config = {}

if (fs.existsSync(configuracion)) {
    config = require('../configs/catalogador.json')
}

class catalogador {
    constructor() {
        this._DBFile = ""
        this._limite = 50
        this._version = '1'
    }

    open(DBFile) {

        if (DBFile)
            this.db = new sqlite3.Database(DBFile, sqlite3.OPEN_READONLY)
        else if (config.database)
            this.db = new sqlite3.Database(config.database, sqlite3.OPEN_READONLY)
    
        return this
    }

    close() {
        this.db.close();
    }

    version () {
        return this._version
    }

    // Parametros:
    // str: vector con las plabras a buscar.
    // nostr: vector con palabrsa que NO tiene que estar.
    search(str, nostr) {
        const that = this

        return new Promise(function (resolve, reject) {
            let vector = []
            let _str, _nostr, existe = "", noexiste = ""

            if (str) {
                _str = str

                _str.forEach(element => { existe += ` and path like '%${element}%' ` })
            }

            if (nostr) {
                _nostr = nostr

                _nostr.forEach(item => { noexiste += ` and path not like '%${item}%' ` })
            }

            that.db.parallelize(function() {
                that.db.each(`
                    SELECT d.nombre || c.archivo AS path, c.tamanio as bytes, c.fecha as date
                    FROM directorio d, catalogov2 c, etiqueta e
                    WHERE d.id_directorio == c.id_directorio and c.id_etiqueta = e.id_etiqueta
                    ${existe} ${noexiste} 
                    limit ${that._limite}`, 
               function(err, row) {
                    vector.push(row)
               }, function(error, total) {
                   if (error) reject(error)
                   else resolve(vector)
               })
            })
        })
    }
}

module.exports = catalogador
