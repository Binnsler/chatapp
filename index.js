/////////////////////////////////////////
// Packages
/////////////////////////////////////////

var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var io = require('socket.io').listen(app.listen(port));
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config.js'); // Get our config file

// Router instances
var router = express.Router();
var apiRouter = express.Router();

/////////////////////////////////////////
// Configuration
/////////////////////////////////////////

mongoose.connect(config.database); // Connect to database

app.use('/css', express.static(__dirname + '/css')); // Accept css local route

// Use bodyParser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev')); // Use morgan to log requests to the console

/////////////////////////////////////////
// Routes
/////////////////////////////////////////

require('./routes/user.js')(router);
require('./routes/api.js')(apiRouter);

/////////////////////////////////////////
// Connect socket.io
/////////////////////////////////////////

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

// Use router and apiRouter
app.use('/', router);
app.use('/api', apiRouter);
