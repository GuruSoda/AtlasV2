const sharp = require('sharp');

(async () => {
    await sharp('pocs/soda-nadapersonal-1985.jpg')
    .rotate()
    .resize(350)
    .toFile('salida.jpg')
    .then( data => { console.log('Todo Bien? : ', data) })
    .catch( err => { console.log('Todo Mal? : ', err) })
})()
