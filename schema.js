
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create user schema
let userSchema = new Schema({
    username: {
      type: String,
      required: true,
    }
})

module.exports = userSchema;