var express = require('express');
var router = express.Router();
var path = require('path');


router.get('/buy/lib', function(req, res, next) {
    res.sendFile(path.join(process.cwd(), 'node_modules', 'braintree-web', 'dist', 'braintree.js'));
});


module.exports = router;
