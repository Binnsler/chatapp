var User = require('../models/user.js'); // Get our User mongoose model
var Chat = require('../models/chat.js'); // Get our User mongoose model
var ObjectID = require('mongodb').ObjectID; // Lets us randomly generate a code

module.exports = function(router){
  router.get('/', function(req, res){
    res.sendFile('index.html', {root: './'});
  });

  router.get('/about', function(req, res){
    res.send('I am the about page.');
  });

  // Join chat - create User and add them to Chat
  router.post('/join', function(req, res){

    var person = new User({
      username: req.body.username
    });

    person.save().then(function(person){
      console.log('User saved successfully: ' + person);
      if (!person){
        res.json({ success: false, message: "Creation Failed, could not create user" })
      }
      else {
        res.send(person);
      }
    }, function (err) {
      if (err.code === 11000)
      res.json({ success: false, message: "A person with the same name already exists" })
    });

    // Have new User join organization from req.body.code
    var chatroom = io.of('/' + req.body.code);

    chatroom.on('connection', function(socket){
      socket.on('chat message', function(msg){
        chatroom.emit('chat message', msg);
      });
    });
  });

  // Create chat - create User and Chat, add user to Chat
  router.post('/create', function(req, res){
    var args = req.body;

    // Create user
    var newUser = new User({username: args.admin});

    newUser.save().then(function(person){
      console.log('User saved successfully: ' + person);
      if (!person){
        res.json({ success: false, message: "Creation Failed, could not create user" })
      }
      else {
        res.send(person);
      }
    }, function (err) {
      if (err.code === 11000)
      res.json({ success: false, message: "A person with the same name already exists" })
    });

    // Create chat
    var newChat = new Chat(args);

    newChat.members.push(newUser._id);

    newChat.save().then(function(chat){
      console.log("NEW chatroom: ", chat)
      if (!chat){
        res.json({ success: false, message: "Creation Failed, could not create chatroom" })
      }
      else {
        res.send(chat);
      }
    }, function (err) {
      if (err.code === 11000)
      res.json({ success: false, message: "An chatroom with the same name already exists" })
    });

    // Connect to socket
    var chatroom = io.of('/' + newChat._id);

    chatroom.on('connection', function(socket){
      socket.on('chat message', function(msg){
        chatroom.emit('chat message', msg);
      });
    });
  });
};
