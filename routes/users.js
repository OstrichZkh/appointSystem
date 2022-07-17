var express = require('express');
var router = express.Router();
let User = require('../controllers/UserController')
/* GET users listing. */
router.post('/sendCode',User.sendCode)
router.post('/sendCoreCode',User.sendCoreCode)
router.post('/codePhoneLogin',User.validateCode)
router.post('/login',User.login)

module.exports = router;
