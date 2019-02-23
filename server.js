const express = require('express');
const app = express();

require('dotenv').load();

let routes = require('./routes');
const mongoose = require('mongoose');
//Initialize mongoose scheme
const Schema = mongoose.Schema;

//import routes and enable for use
app.use('./routes', routes);

//Initialize mongoose connection with cloud db server
mongoose.connect(process.env.MLAB_URI, function(err) {
  if(err) {
    console.log(err);
  }
  //Log if connection was established or not
  console.log(mongoose.connection.readyState, "Mongo DB connection established");
  //Delete all collections currently present in the db to start fresh
  
});

//Connect to the mongo database
mongoose.connection.on('open', function(){
  // Delete existing documents on connection
  mongoose.connection.db.dropDatabase();
});

//Create user schema
let userSchema = new Schema({
  username: {
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

// Save the userTim document
userTim.save(function(err, userTim) {
  if(err) {
    console.log(err);
  }
  //console.log(userTim._id);
});






const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
