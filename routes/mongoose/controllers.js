let User = require('./models/user');
let Log = require('./models/exercise_log');
let moment = require('moment');


//Function that takes user form input as username and creates/saves a new user
exports.post_user = (req, res) => {
    let userInput = req.body.username;
    //Set new user instance of User model
    let newUser = new User({username: userInput});
    // Save the new user to the database
    newUser.save((err, newUser) => err ? res.send({errorMessage: err.message}) : res.send({userId: newUser._id}));  
}

//Function that takes exercise form input, applies it to a user and saves as a subdocument in the db
exports.post_exercise = (req, res) => {
  let inputId = req.body.userId;
  
  User.findById(inputId, (err,user) => {
    if(err) {
      console.log(err);
      res.send({errorMessage: err.message});
    }
    else {
      
      let userLog = new Log ({
        uid: inputId,
        description: req.body.description, 
        duration: req.body.duration, 
        date: req.body.date == "" ? undefined : req.body.date,
      });
      userLog.save((err, newLog) => err ? res.send({errorMessage: err.message}) : console.log("new exercise log saved"))
      user.exerciseLogs.push(userLog);
    
      user.save(function (err) {
        if (err) {
          console.log(err);
          res.send({errorMessage: err.message});
        }
        else {
          console.log('Success! Exercise Added to User', user.exerciseLogs);
          res.json({userData: user});
        } 
      });
    };
  });
  
};

//Function that displays all users in the database
exports.get_users = (req, res) => {
  // Find any user
  User.find({}, (err, users) => {
    if(err) {
      console.log(err);
    }
    let userArr = [];
    // Add each user to the user array
    users.forEach( user => {
        let {username, _id} = user
        userArr.push({username, _id});
      
    });
    //Return the user array at route
    res.send(userArr);
  }); 
}

exports.get_user_exercise_log = (req, res) => {
  let userId = req.param('userId');
  let fromDate = req.param('from') || "";
  let toDate = req.param('to') || "";
  //console.log(userId, fromDate,toDate); 
  User.findById(userId, (err,user) => {
    if(err) {
      console.log(err);
      res.send({errorMessage: err.message});
    }
    else if(fromDate && toDate != "") {
      //console.log(fromDate,toDate);
      //let childArr = user.children;
      //let query = user.children.find({date: { $gte: fromDate, $lte: toDate }});
      Log.find({uid: userId, date: { $gte: fromDate, $lte: toDate }}, (err,result) => {
        if(err) {
          console.log(err);
        }
        res.json(result);
     })
    }
    else {
      user.exerciseCount = user.exerciseLogs.length;
      user.save(function (err) {
        if (err) {
          console.log(err);
          res.send({errorMessage: err.message});
        }
        else {
          
          res.json({userData: user});
        } 
      });
      
    };
  });
  
}

