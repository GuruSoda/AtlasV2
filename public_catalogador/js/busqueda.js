async function onBuscar() {
    let str = document.getElementById('search')

    let busqueda = analizarBusqueda(str.value)

    let tabla = '<ul class="collapsible">'

    let resultado = await catalogador.buscar(busqueda.str, busqueda.nostr)

    for (i=0;i<resultado.length;i++) {
        tabla += `<li>
                    <div class="collapsible-header">
                        <i class="material-icons">archive</i>
                            ${resultado[i].path}
                        <span class="new badge" data-badge-caption="">${resultado[i].etiqueta}</span>
                    </div>
                    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p>
                    </div>
                </li>`
    }

    tabla += '</ul>'

    document.getElementById('resultado-busqueda').innerHTML = tabla

}

async function onBuscarV2() {
    let str = document.getElementById('search')

    let busqueda = analizarBusqueda(str.value)

    let resultado = (await catalogador.buscar(busqueda.str, busqueda.nostr)).map(function(obj) {
        return `
            <tr>
                <td>${obj.path}</td>
                <td>${obj.bytes}</td>
            </tr>`
    })

    let tabla = tablaResultado(resultado)

    document.getElementById('resultado-busqueda').innerHTML = tabla
}

function tablaResultado(res) {

    let DOMTabla = `
    <table class="highlight">
    <thead>
      <tr>
          <th>Nombre</th>
          <th>Bytes</th>
      </tr>
    </thead>`

    for (i=0;i<res.length;i++) DOMTabla += res[i]

    DOMTabla += '<tbody></tbody></table>'

    return DOMTabla
}

function analizarBusqueda(str) {
    let _str = [], _nostr = []

    // lo convierto a vector
    str.split(' ').forEach(element => {
        if (element.charAt(0) === '+') _str.push(element.substring(1))
        else if (element.charAt(0) === '-') _nostr.push(element.substring(1))
        else _str.push(element)
    });

    let objBusqueda = {}
    
    if (_str.length) objBusqueda.str = _str
    if (_nostr.length) objBusqueda.nostr = _nostr

    return objBusqueda
}

function cargarListaCatalogos() {
    let lista = document.getElementById('lista-catalogos')

    if (lista) {

        let items = ''

        catalogador.catalogos().then(function(data){

            for (i=0;i<data.length;i++)
                items += `<li><a>${data[i].nombre}</a></li>`
            
            lista.innerHTML = items
        })
    }
}
