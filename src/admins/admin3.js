const express = require('express');
const router = express.Router();
router.route('/member/edit/:id')
    .all((req, res, next) => {
        res.locals.memberData = {
            name: 'jason',
            id: req.params.id,
        };
        res.locals.memberData2 = {
            name: 'jason',
            id: req.params.id,
        };
        next()
    })
    .get((req, res) => {
        res.send('get:' + JSON.stringify(res.locals));
    })
    .post((req, res) => {
        res.send('post:' + JSON.stringify(res.locals));
    })
module.exports = router;
