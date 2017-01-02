var express = require('express');
var router = express.Router();

/* GET home page. */
/*
router.get('/room', function(req, res, next) {
  res.render('blackjack', { title: 'Express' });
});
*/
var roomInfo =[]

router.get('/room/:roomID', function (req, res) {
  var roomID = req.params.roomID;
   var user = req.query.user;
  console.log(user)

  // 渲染页面数据(见views/room.hbs)
  res.render('blackjack', {
    roomID: roomID,
    users: user
  });
});

module.exports = router;
