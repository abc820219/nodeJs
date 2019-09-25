//引入express應用程式
const express = require('express')
const url = require('url');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'tmp_uploads' });
const fs = require('fs');
const admin1 = require(__dirname + '/admins/admin1');
const mysql = require('mysql');

//啟動
// var db = mysql.createConnection({
//     host: 'localhost',
//     user: 'jason',
//     password: 'z27089433',
//     database: 'mytest'
// });
// db.connect();

var app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');

//middle ware 啟動靜態資料夾 & 判斷如果是GET以外的方法就解析的函式要安裝QS才能用true & 接收表單傳進來的JSON時解析JSON
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require(__dirname + '/admins/admin2'));
app.use('/admin3', require(__dirname + '/admins/admin3'));//送一個根目錄


app.get('/', function (req, res) {//根目錄
    res.render('home', { name: 'jason' });
})


//設定路由
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

app.post('/try-post-form', (req, res) => {
    res.render('try-post-form', req.body);
    console.log(req.body);
    res.send(JSON.stringify(req.body));
});

app.get('/try-post-form2', (req, res) => {
    res.send('get try-post-form');
});
app.post('/try-post-form2', (req, res) => {
    res.send(req.body);
});

app.put('/try-post-form2', (req, res) => {
    res.send('put try-post-form');
});


app.get('/get2', function (req, res) {
    res.send('hello2');
});


app.get('/upload', (req, res) => {
    res.render('upload');
})
//多圖
app.post('/upload', upload.array('avatar', 2), (req, res) => {//單張圖片上傳
    console.log(req.files);
    let arrayS = [];
    for (let i in req.files) {
        switch (req.files[i].mimetype) {
            case "image/png":
            case "image/jpeg":
            case "image/jpg":
                fs.createReadStream(req.files[i].path)//讀檔案
                    .pipe(//串進去
                        fs.createWriteStream('public/img/' + req.files[i].originalname)//寫檔案
                    );
                arrayS.push(req.files[i].originalname)
                break;
            default:
        }
    }
    res.json(arrayS);
});

// 單圖
// app.post('/upload', upload.single('avatar'), (req, res) => {//單張圖片上傳
// if (req.file && req.file.originalname) {
// switch (req.file.mimetype) {
//     case "image/png":
//     case "image/jpeg":
//     case "image/jpg":
//         res.json(req.file);
//         fs.createReadStream(req.file.path)//讀檔案
//             .pipe(//串進去
//                 fs.createWriteStream('public/img/' + req.file.originalname)//寫檔案
//             );
//         break;
//     default:
// }
// } else {
//     res.send('87')
// }
// });

//?可填可不填,:可以自己指定值給自己定義的屬性,*變成屬性變成索引
app.get('/my-params1/:action/:id', (req, res) => {
    res.json(req.params);
});
app.get('/my-params2/:action?/:id?', (req, res) => {
    res.json(req.params);
});
app.get('/my-params3/*/*', (req, res) => {
    res.json(req.params);
});

app.get(/^\/09\d{2}\-?\d{3}\d{3}$/, (req, res) => {
    let str = req.url.slice(1);
    str = str.split('-').join('');
    str = str.split('?')[0];
    console.log(str);
    // res.send('tel:' + str.slice(0, 10));
    res.send('tel:' + str);
});

//連線資料庫
app.get('/test_list', (req, res) => {
    var sql = "SELECT * FROM `members`";
    db.query(sql, (error, results) => {
        if (error) throw error;
        console.log(results);
        res.json(results);
    });
});

admin1(app);

//沒有別的路由啟動時啟動這個
app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send(`404`);
});



//給一個空間3000不能重複啟動
app.listen(3001, function () {
    console.log('已經啟動:localhost:3001');
});