//引入express應用程式
const express = require('express')
const url = require('url');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'tmp_uploads' });
const fs = require('fs');

//啟動
var app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');

//middle ware 啟動靜態資料夾 & 轉譯 & 轉譯JSON
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


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
//單圖
app.post('/upload', upload.array('avatar', 2), (req, res) => {//單張圖片上傳
    console.log(req.files);
    let arrayS = [];
    // res.json(req.files);
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
    // console.log(arrayS);
});

//多圖
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