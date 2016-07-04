const express = require('express');
const router = express.Router();
const path = require('path');


router.get('/buy/lib', (req, res, next) => {
    res.sendFile(path.join(process.cwd(), 'node_modules', 'braintree-web', 'dist', 'braintree.js'));
});


module.exports = router;
