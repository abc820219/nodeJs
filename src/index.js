//引入express應用程式
const express = require('express')
const url = require('url');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'tmp_uploads' });//設定檔案暫存目錄
const fs = require('fs');//讀檔案寫檔案
const admin1 = require(__dirname + '/admins/admin1');
const session = require('express-session');
const mysql = require('mysql');
const moment = require('moment-timezone');
const bluebird = require('bluebird');
const cors = require('cors');//開放網域
//啟動
var file = 'C:/__connect_db.json';
var db_Obj = JSON.parse(fs.readFileSync(file));
var db = mysql.createConnection(db_Obj);
db.connect();

bluebird.promisifyAll(db);
var app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.set('view engine', 'ejs');

//middle ware 啟動靜態資料夾 & 轉譯 & 轉譯JSON
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());//解析JSON
app.use(require(__dirname + '/admins/admin2'));
app.use('/admin3', require(__dirname + '/admins/admin3'));//送一個根目錄
app.use(session({
    //上面兩個未來預設可能會變成true先設定好
    saveUninitialized: false,
    resave: false,
    secret: '69',
    //存活時間cookie底下才有session
    cookie: {
        maxAge: 1200000,
    }
}));
app.use(cors());



//設定路由
app.get('/', function (req, res) {//根目錄
    res.render('home', { name: 'jason' });
})

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

//?可填可不填,:可以自己指定值給自己定義的 屬性,*變成屬性變成索引
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
    str = str.split('?')[0];//切兩段拿前面那段
    console.log(str.length);
    // res.send('tel:' + str.slice(0, 10));
    res.send('tel:' + str);
});
//SESSION測試
app.get('/try-session', (req, res) => {
    req.session.my_views = req.session.my_views || 0;
    req.session.my_views++;
    res.json({
        guest: "guest",
        "guestNumber": req.session.my_views
    });
});

app.get('/try-session2', (req, res) => {
    req.session.my_views = req.session.my_views || 0;
    req.session.my_views++;
    res.json({
        views: req.session.my_views,
    });
});

//moment測試
app.get('/try-moment', (req, res) => {
    const myFormat = 'YYYY-MM-DD HH:mm:ss';
    const exp = req.session.cookie.expires;
    const mo1 = moment(exp);
    const mo2 = moment(new Date());
    res.contentType('text/plain');
    res.write(exp + "\n");
    res.write(new Date() + "\n");
    res.write('台灣現在:' + mo2.format(myFormat) + "\n");
    res.write('台灣session到期:' + mo1.format(myFormat) + "\n");
    res.write('東京現在' + mo2.tz('Asia / Tokyo').format(myFormat) + "\n");
    res.write('東京session到期:' + mo1.tz('Asia / Tokyo').format(myFormat) + "\n");
    res.end('');
})

//連線資料庫
app.get('/test_list', (req, res) => {
    var sql = "SELECT * FROM `address_book` WHERE NAME LIKE ? LIMIT 0,100";
    db.query(sql, ["%%"], (error, results, fields) => {
        if (error) throw error;
        console.log(fields);
        // res.json(results);
        for (let v of results) {
            v.birthday = moment(v.birthday).format('YYYY-MM-DD');
        }
        res.render('test_list', {
            array: results
        });
    }); 
});

//queryAsync&promise
app.get('/promise/:page?', (req, res) => {
    let sql = "SELECT COUNT(1) total FROM `address_book`";
    let page = req.params.page || 1;//url後面的值
    let perPage = 5;//要幾筆
    let obj = {};
    let sqlPage = `SELECT * FROM address_book LIMIT ${(page - 1) * perPage},${perPage}`;//0-5
    db.queryAsync(sql)
        .then(results => {
            obj.total = results[0].total;
            return db.queryAsync(sqlPage);
        })
        .then(results => {
            obj.rows = results;
            res.json(obj);
        })
        .catch(error => {
            console.log(error);
            res.send(error);
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
app.listen(3000, function () {
    console.log('已經啟動:http://localhost:3000/');
});