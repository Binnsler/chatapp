var express = require('express');
var app = express();
var config = require('../config.js'); // Get our config file
var User = require('../models/user.js'); // Get our mongoose model
app.set('superSecret', config.secret); // Secret variable
var jwt = require('jsonwebtoken'); // Used to create, sign, and verify tokens

module.exports = function(apiRouter){

  apiRouter.post('/authenticate', function(req, res){
    // Find the users
    User.findOne({name: req.body.name}, function(err, user){
      if(err){throw err;}
      if(!user){
        res.json({success:false, message: 'Authentication failed. User not found.'})
      }
      else if(user){
        // Check if password matches
        if(user.password != req.body.password){
          res.json({success: false, message: 'Authentication failed. Wrong password.'})
        }
        else{
          // If User is found and password is correct, create a token
          var token = jwt.sign(user, app.get('superSecret'), {expiresIn: 1440});

          // Return the information including token as json
          res.json({success: true, message: 'Enjoy your token!', token: token});
        }
      }
    });
  });

  // Route Middleware to verify a JWT token
  apiRouter.use(function(req, res, next){
    // Check header or url parameters or post parameters for a JWT token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token){
      // Verify secret and check for errors
      jwt.verify(token, app.get('superSecret'), function(err, decoded){
        if(err){
          return res.json({success: false, message: 'Failed to authenticate token.'})
        }
        else{
          req.decoded = decoded;
          next();
        }
      });
    }
    else{
      // If there is no token, return error
      return res.status(403).send({success: false, message: 'No token provided.'});
    }
  });

  // Route to show a welcome message
  apiRouter.get('/', function(req, res){
    res.json({message: 'Welcome to the the Slackesque Chat App.'})
  });

  // Route to return all users (GET http://localhost:8080/api/users)
  apiRouter.get('/users', function(req, res){
    User.find({}, function(err, users){
      res.json(users);
    })
  });


};
