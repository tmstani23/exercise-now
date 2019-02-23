const express = require('express');
const app = express();

require('dotenv').load();
let middleware = require('./middleware');
let routes = require('./routes');
let main = require('./app');
const mongoose = require('mongoose');
//Initialize mongoose scheme



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


//Import middleware and enable
app.use(middleware);
//import routes and enable for use
app.use('/', routes);
//Create first seed user:
main.createTim;

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
