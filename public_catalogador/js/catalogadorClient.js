class catalogadorClient {
    constructor() {
        this._URLCatalogador = ""
        this._version = 0
    }

    async open(url) {
        this._URLCatalogador = url

        const response = await fetch(this._URLCatalogador + '/catalogador/version')
        const json = await response.json()

        this._version = json.version
    }

    version () {
        return this._version
    }

    async buscar(str, nostr) {
/*
        // forma normal:
        return fetch(this._urlArMame + this._vdirmame + '/games/search', {
            method: 'POST',
            body: JSON.stringify({ word: str }),
            headers:{ 'Content-Type': 'application/json' }
        }).then(function(body) {
            return body.json()
        }).then(function(json) {
            return json
        })
*/
            // forma moderna:
        let opciones = {
            method: 'POST',
            body: JSON.stringify({ word: str, noword: nostr }),
            headers:{ 'Content-Type': 'application/json' }
        }

        const res = await fetch(this._URLCatalogador + '/catalogador/search', opciones)
        return await res.json()
    }
}
