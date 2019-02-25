

const mongoose = require('mongoose');
const userSchema = require('./schema.js');
  
//Create user model
let User = mongoose.model("User", userSchema);
  


module.exports = User;