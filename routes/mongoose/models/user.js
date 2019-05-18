
const mongoose = require('mongoose');
const schemas = require('./../schema.js');
  
//Create user model
let User = mongoose.model("User", schemas.userSchema);
  


module.exports = User;