
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create user schema
//Create sub-schema of each user as exercise schema
let exerciseSchema = new Schema({
  uid: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
         
});

let userSchema = new Schema({
    username: {
      type: String,
      required: true,
    },
    children: [exerciseSchema],
});



module.exports = {
  exerciseSchema: exerciseSchema,
  userSchema: userSchema,
};