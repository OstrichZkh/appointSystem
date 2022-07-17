var express = require('express');
var router = express.Router();
let App = require('../controllers/AppController')

router.post('/makeappoint',App.makeappoint)
router.get('/getapplist',App.getapplist)
router.get('/getteacher',App.Getteacher)


module.exports = router;