const mongoose = require('mongoose');
const schemas = require('./../schema.js');
  
//Create user model
let Log = mongoose.model("Log", schemas.exerciseSchema);
  


module.exports = Log;