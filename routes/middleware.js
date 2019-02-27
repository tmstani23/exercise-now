const cors = require('cors');
let express = require('express');
let router = express.Router();
const bodyParser = require('body-parser');
//Express Middleware:

//Enable cors for cross site requests
router.use(cors())

// Include bodyparser middleware for parsing message body in form posts
router.use(bodyParser.urlencoded({extended: false}))
router.use(bodyParser.json())

//Use public folder to allow using public folderand its css file
router.use(express.static('public'));
//Use views folder and its html file
router.use(express.static('views'));


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

module.exports = router;