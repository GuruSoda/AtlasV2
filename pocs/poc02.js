const Thumbler = require('thumbler');

(async () => {
Thumbler({
    type: 'video', 
    input: 'pocs/uxzT1473855355800.mp4',
    output: 'output.jpeg', 
    time: '00:00:22',
    size: '300x200' // this optional if null will use the desimention of the video
}, function(err, path){
    if (err) console.log(err)
    else console.log(path)
})})()
