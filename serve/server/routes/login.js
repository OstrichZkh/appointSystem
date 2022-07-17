var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken')
let Login = require('../controllers/LoginController')

router.get('/codeFake',Login.sendCodeFake)
router.get('/codeAli',Login.sendCodeAli)
router.post('/register',Login.Register)
router.post('/validate',Login.Validate)
router.get('/getinfo',Login.Getinfo)
router.post('/revinfo',Login.Revinfo)


module.exports = router;