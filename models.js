

const mongoose = require('mongoose');
const userSchema = require('./schema');



  
//Create user model
let User = mongoose.model("User", userSchema);
  


module.exports = User;