const express = require('express');
const mysql = require('mysql');
const fs = require('fs');//讀檔案寫檔案
var file = 'C:/__connect_db.json';
var db_Obj = JSON.parse(fs.readFileSync(file));
var db = mysql.createConnection(db_Obj);
db.connect();
const router = express.Router();
const bluebird = require('bluebird');
bluebird.promisifyAll(db);
console.log(express.aaaa);

router.get('/:page?/:keyword?', (req, res) => {
    let perPage = 10;
    const output = {};
    output.params = req.params;//url
    output.perPage = perPage;//10筆
    let page = parseInt(req.params.page) || 1;
    
    // console.log(origin);
    let keyword = output.params.keyword || "";
    let where = "WHERE 1"
    if (keyword) {
        keyword = keyword.split("'").join("\\'");//防範SQL injection
        where += ` AND (name LIKE "%${keyword}%" OR address LIKE "%${keyword}%")`//不是數值的時候就要單引號
        // where += ` AND '*' LIKE "%${keyword}%" `//不是數值的時候就要單引號
        // where += " AND `name` LIKE '%"  keyword + "%' ";
    }
    let t_sql = "SELECT COUNT(1) total FROM `address_book`" + where; //total變數
    let sql = `SELECT * FROM address_book ${where} LIMIT ${(page - 1) * perPage} , ${perPage}`;
    db.queryAsync(t_sql)
        .then(results => {
            output.totalRows = results[0].total;//總比數
            output.totalPage = Math.ceil(output.totalRows / output.perPage);//總頁數
            if (output.totalPage === 0) return;//沒資料的時候返回
            if (page < 1) page = 1;
            if (page > output.totalPage) page = output.totalPage;
            output.page = page;//輸出page

            return db.queryAsync(sql);
        })
        .then(result => {
            output.rows = result;
            res.json(output);
        }).catch(error => {
            console.log(error);
        })
});
// const perPage = 10;
// const page = req.params.page || 1;
// const output = {};
// output.params = req.params;
// console.log(output.params);
// db.query(sql, (error, result) => {
//     output.row = result;
//     res.json(output);
// });
module.exports = router;
