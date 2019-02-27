const express = require('express');
const app = express();
let middleware = require('./routes/middleware.js');
let routes = require('./routes/routes.js');
let main = require('./app');
const mongoose = require('mongoose');



//Initialize mongoose connection with cloud db server
mongoose.connect(process.env.MLAB_URI, function(err) {
  if(err) {
    console.log(err);
  }
  //Log if connection was established or not
  console.log(mongoose.connection.readyState, "Mongo DB connection established");
  //Delete all collections currently present in the db to start fresh
  
});

//Once database connection is open:
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

// Main server listener that accepts http connections on port or localhost 3000
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
