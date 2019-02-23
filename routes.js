var express = require('express')
var router = express.Router()
const cors = require('cors');
require('dotenv').load();
const bodyParser = require('body-parser');


//Express Middleware:

//Enable cors for cross site requests
router.use(cors())

// Include bodyparser middleware for parsing message body in form posts
router.use(bodyParser.urlencoded({extended: false}))
router.use(bodyParser.json())

//Use public folder to allow using public folder and its css file
router.use(express.static('public'));

//Root route that displays html file from views folder
router.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// Error Handling middleware
router.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

//Create post route that creates new user with submitted data
router.post("/api/exercise/new-user", function(req, res) {
  let userInput = req.body.username;
  let newUser = new User({username: userInput});
  newUser.save(function(err, newUser) {
    if(err) {
      console.log(err);
    }
    else {
      res.send({userId: newUser._id})
    }  
  });  
});

module.exports = router