
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Create sub-schema of each user as exercise schema
let exerciseSchema = new Schema({
  
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
  },
       
}, { usePushEach: true });

//Create user schema
let userSchema = new Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    exerciseCount: {
    type: Number,
    },
    children: [exerciseSchema],
}, { usePushEach: true });



module.exports = {
  exerciseSchema: exerciseSchema,
  userSchema: userSchema,
};