const http = require('http'), fs = require('fs');

http.createServer((req, res) => {
    fs.writeFile(__dirname + '/header01.json', JSON.stringify(req.headers), error => {
        if (error) {
            return console.log('error');
        } else {
            console.log(JSON.stringify(req.headers));
        }
    })
}).listen(3001);
