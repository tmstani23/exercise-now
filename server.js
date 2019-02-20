const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').load();
const cors = require('cors')

const Schema = mongoose.Schema;
const mongoose = require('mongoose')

//Initialize mongoose connection with cloud db server
mongoose.connect(process.env.MLAB_URI, function(err) {
  if(err) {
    console.log(err);
  }
  //Log if connection was established or not
  console.log(mongoose.connection.readyState, "Mongo DB connection established");
});

//Create user schema
let userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  }
})

//Create user model
let User = mongoose.model("User", userSchema);

//Create first test user
let userTim = new User({
  username: "Timothy",
});

// Save the test user to the db
userTim.save();


//console.log(process.env.MLAB_URI);

app.use(cors())
// Include bodyparser middleware for parsing message body in form posts
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Use public folder to allow using public folder and its css file
app.use(express.static('public'));

//Root route that displays html file from views folder
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
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




// app.post("/addname", (req, res) => {
//   var myData = new User(req.body);
//   myData.save()
//     .then(item => {
//       res.send("item saved to database");
//     })
//     .catch(err => {
//       res.status(400).send("unable to save to database");
//     });
// });




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
