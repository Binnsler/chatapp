var User = require('../models/user.js'); // Get our User mongoose model
var Org = require('../models/org.js'); // Get our User mongoose model
var ObjectID = require('mongodb').ObjectID; // Lets us randomly generate a code

module.exports = function(router){
  router.get('/', function(req, res){
    res.sendFile('index.html', {root: './'});
  });

  router.get('/about', function(req, res){
    res.send('I am the about page.');
  });

  // Create user
  router.post('/create', function(req, res){
    var person = new User({
      username: req.body.username
    });

    person.save(function(err){
      if(err){
        throw err;
      }

      console.log('User saved successfully' + person.username);
      res.json({success: true});
    });

    // Have new User join organization from req.body.code
  });

  // Create Org
  router.post('/createOrg', function(req, res){
    var args = req.body;
    args.code = new ObjectID;
    console.log(args);

    var newUser = new User(args.admin);

    var newOrg = new Org(args);

    newOrg.members.push(newUser._id);

    newOrg.save().then(function (org) {
      console.log("NEW Orgnaization: ", org)
      if (!org)
      res.json({ success: false, message: "Creation Failed, could not create organization" })
      else {
        res.send(org);
      }
    }, function (err) {
      if (err.code === 11000)
      res.json({ success: false, message: "An organization with the same name already exists" })
    });
  });
};
