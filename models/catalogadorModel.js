const sqlite3 = require('sqlite3').verbose()

class catalogador {
    constructor() {
        this._DBFile = ""
        this._limite = 50
    }

    open(DBFile) {

        console.log('por abrir: ', DBFile)

//        if (DBFile)
            this.db = new sqlite3.Database(DBFile, sqlite3.OPEN_READONLY)
//        else
//            this.db = new sqlite3.Database(config.database, sqlite3.OPEN_READONLY)
    
        return this
    }

    close() {
        this.db.close();
    }

    search(str) {
        const that = this

        return new Promise(function (resolve, reject) {
            let vector = []

            that.db.parallelize(function() {
                that.db.each(`
                SELECT d.nombre || c.archivo AS path, c.tamanio as bytes, c.fecha as date
                FROM directorio d, catalogov2 c, etiqueta e
                WHERE d.id_directorio == c.id_directorio and c.id_etiqueta = e.id_etiqueta
                and path like '%${str}%'
                limit ${that._limite}`, function(err, row) {
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
