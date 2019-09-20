//引入express應用程式
var express = require('express')
const url = require('url');
const bodyParser = require('body-parser');

//啟動
var app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');

//啟動靜態資料夾
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', function (req, res) {//根目錄
    res.render('home', { name: 'jason' });
})


//設定路由1號 2號
app.get('/0920sale', function (req, res) {
    const data = require(__dirname + './../data/0920sale.json');
    res.render('0920sale', {
        sales: data
    });
});

app.get('/try-qs', (req, res) => {
    const urlParts = url.parse(req.url, true);
    console.log(urlParts);

    res.render('try-qs', {
        query: urlParts.query
    });
});


app.get('/try-post-form', (req, res) => {
    res.render('try-post-form');
});
app.post('/try-post-form', urlencodedParser, (req, res) => {
    res.render('try-post-form', req.body);
    console.log(req.body);
    // res.send(JSON.stringify(req.body));
});


app.get('/get2', function (req, res) {
    res.send('hello2');
});

//沒有別的路由啟動時啟動這個
app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404');
});

//給一個空間3000不能重複啟動
app.listen(3000, function () {
    console.log('已經啟動:http://localhost:3000/');
});