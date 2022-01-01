var express = require('express');
var router = express.Router();

var hand_data = require('../data/hand_data')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { 
    title: 'Online Golf Game | Login',
    loginerror: req.app.locals.loginerror,
    loginerrormessage: req.app.locals .loginerrormessage
  });
});

router.get('/game', function(req, res, next) {
  res.render('game', {
    hand_data: hand_data
  })
});

module.exports = router;
