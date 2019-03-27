let User = require('./models/user');
let Log = require('./models/exercise_log');


//Function that takes user form input as username and creates/saves a new user
exports.post_user = (req, res) => {
    let userInput = req.body.username;
    //Set new user instance of User model
    let newUser = new User({username: userInput});
    // Save the new user to the database
    newUser.save((err, newUser) => err ? res.send({errorMessage: err.message}) : res.send({username:userInput, userId: newUser._id}));  
}

//Function that takes exercise form input, applies it to a user and saves as a subdocument in the db
exports.post_exercise = (req, res) => {
  //Get the user id from the request post body
  let inputId = req.body.userId;
  //Search the User document for a user matching the input id
  User.findById(inputId, (err,user) => {
    if(err) {
      console.log(err);
      res.send({errorMessage: err.message});
    }
    else {
      //Create a new log model using the post input fields as data
      let userLog = new Log ({
        uid: inputId,
        description: req.body.description, 
        duration: req.body.duration, 
        //Set date to undefined if left blank so the default date will get auto populated
          //Mongoose sees an empty string as a valid input
        date: req.body.date == "" ? undefined : req.body.date,
      });
      //Save the new log
      userLog.save((err, newLog) => err ? res.send({errorMessage: err.message}) : console.log("new exercise log saved"))
      //Add the log to the user exercise logs array
      user.exerciseLogs.push(userLog);
      //Update the user exercise count field to = the length of exercise log array
      user.exerciseCount = user.exerciseLogs.length;
      //Save the newly updated user to the db and display the updated user object as json
      user.save(function (err) {
        if (err) {
          console.log(err);
          
        }
        else {
          console.log('Success! Exercise Added to User', user.exerciseLogs);
          res.json({userData: user, newLog: user.exerciseLogs[user.exerciseLogs.length - 1] });
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
      res.send({errorMessage: err})
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

//Function to get a user's exercise logs using url parameters
exports.get_user_exercise_log = (req, res) => {
  //Save url parameters as variables for use
  let userId = req.body.userId;
  let fromDate = req.body.fromDate || "";
  let toDate = req.body.toDate || "";
  //Search User collection by input id
  User.findById(userId, (err,user) => {
    if(err) {
      console.log(err);
      res.send({errorMessage: err.message});
    }
    //If from and to date fields are not empty
    else if(fromDate && toDate != "") {
      //Search Log db collection for fields matching the date range and uid
      Log.find({uid: userId, date: { $gte: fromDate, $lte: toDate }}, (err,result) => {
        if(err) {
          console.log(err);
        }
        //Send an error message if there are no results
        if(result.length == 0) {
          res.send({errorMessage: "No results matched your search.  Try different search parameters."})
        }
        //Send the result logs as json
        res.json(result);
     })
    }
    //Else if there is no errors or date range:
    else {
      //Send the complete user object as json
      res.json({userData: user});
    };
  });
  
}

