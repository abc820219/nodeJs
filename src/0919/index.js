//引入express應用程式
var express = require('express')
//啟動
var app = express();


app.set('view engine', 'ejs');

//啟動靜態資料夾
app.use(express.static(__dirname + '/../public'));


//設定路由1號 2號
app.get('/get1', function (req, res) {
    res.render('home', { name: 'jason' });
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
    console.log('3000p');
});