var arguments = process.argv.splice(2);
var option = {simulate:true}

if (arguments[0]!=1) {
   option.simulate =false
} 
console.log(option)
var express = require('express')
var  app = express()
var server = require('http').createServer(app)
var  io = require('socket.io').listen(server);

var path = require('path')
var bodyParser = require("body-parser");  
app.use(bodyParser.urlencoded({ extended: false }));  

//server.listen(3001);


var index = require('./routes/index');
var blackjack = require('./routes/blackjack');


app.use('/', index);
app.use('/blackjack', blackjack);


var port = process.env.PORT || 3001;
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

var ejs = require('ejs');
app.engine('html',ejs.__express);
app.set('view engine', 'html');

app.set('views', __dirname + '/public/views');
app.set('public', __dirname + '/public');
app.set('js', __dirname + '/public/js');
app.set('css', __dirname + '/public/css');

//设定静态页面路径
app.use(express.static(path.join(__dirname, 'public')));
io.set('log level', 1);



var Room= require('./js/server/room.js');
room = new Room(io,option);
