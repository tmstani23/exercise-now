const express = require('express');
const app = express();
let middleware = require('./routes/middleware.js');
let routes = require('./routes/routes.js');
let main = require('./app');
require('dotenv').config();
const mongoose = require('mongoose');
let moment = require('moment');
let test_uri = process.env.TEST_DB_URI;
const path = require('path');


//Initialize mongoose connection with cloud db server
mongoose.connect(process.env.DATABASE_URL || test_uri, function(err) {
  
  if(err) {
    console.log(err);
    
  }
  //Log if connection was established or not
  console.log(mongoose.connection.readyState, "Mongo DB connection established");
});

// mongoose.connect("mongodb://localhost:27017/exercise_db", function(err) {
//   if(err) {
//     console.log(err);
//   }
//   //Log if connection was established or not
//   console.log(mongoose.connection.readyState, "Mongo DB connection established");
//   //mongoose.connection.db.dropDatabase();
// });


// convert all dates to formatted dates
app.set('json replacer', function (key, value) {
  if (this[key] instanceof Date) {
// Convert to format: January, 23, 1999
value = moment(this[key]).format('MMMM, DD, YYYY');
  }
  return value;
});
//Import middleware and enable
app.use(middleware);
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
//import routes and enable for use
app.use('/', routes);


//Create first seed user:
//main.createTim;

// Main server listener that accepts http connections on port or localhost 3000
const listener = app.listen(process.env.PORT || 4000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
