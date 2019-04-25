let User = require('./models/user');
let Log = require('./models/exercise_log');


// Helper Functions:
let calculateSkip = (skip, limit, totalResults, prevResults) => {
  console.log(skip, limit, totalResults, prevResults, "beforelogic");
  if(skip + limit < totalResults) {
    skip = skip + limit;
    
  }
  else if (skip + limit >= totalResults && totalResults != 0) {
    skip = totalResults - limit;
  }
  
  if (prevResults == true) {
    skip = skip - limit;
    prevResults = false;
  }

  if (skip < 0) {
    skip = 0;
  }
  console.log(skip, limit, totalResults, prevResults, "afterlogic");
  return skip;
}

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
  let limit = req.body.limit;
  let skip = req.body.skip;
  let totalResults = req.body.totalResults;
  let prevResults = req.body.prevResults;

  User.find({})
  .countDocuments((err, count) => {
    if(err) {
      console.log(err)
    }
    //console.log(count, "total count");
    totalResults = count;
  })
  
  //Update skip value based on current skip value total results prev results and limit.
  skip = calculateSkip(skip, limit, totalResults, prevResults)
  //reset prevResults flag
  //prevResults = false;

  //console.log(skip, limit, totalResults, prevResults, "afterlogic");
  // Find any user
  User.find({})
    .limit(limit)
    .skip(skip)
    .exec((err,users) => {
      if(err) {
        return res.send({errorMessage: err})
      }
      //console.log(users);
      let userArr = [];
      let userCount = users.length;
      // Add each user to the user array
      users.forEach( user => {
          let {username, _id} = user
          userArr.push({username, _id});
      });
      //Return the user array at route
      return res.send({userArr: userArr, skip: skip, prevResults: prevResults, totalResults: totalResults});
      //return res.send(userArr);
    }) 
}

exports.get_user_exercise_log = (req, res) => {
  //Save url parameters as variables for use
  let userId = req.body.userId;
  let skip = req.body.skip;
  let totalResults = req.body.totalResults;
  let prevResults = req.body.prevResults;
  let fromDate = req.body.fromDate;
  let toDate = req.body.toDate;
  let limit = Number(req.body.limit);

  //Search User collection by input id

    //If from and to date fields are not empty
    if(fromDate != "" || toDate != "") {
      
      //Get total count of log entries between date range:
      Log.find({uid: userId, date: { $gte: fromDate, $lte: toDate }}).countDocuments((err, count) => {
        if (err) {
          console.log(err);
        }
        //console.log(count, "total count");
        totalResults = count;
      });
      
      //Update skip value based on current skip value total results prev results and limit.
      skip = calculateSkip(skip, limit, totalResults, prevResults)
      //reset prevResults flag
      prevResults = false;
      
      //Search Log db collection for fields matching the date range and uid
      Log.find({uid: userId, date: { $gte: fromDate, $lte: toDate }} )
      .limit(limit)
      .exec((err,result) => {
        if(err) {
          return res.send({errorMessage: err.message});
        }
        //Send an error message if there are no results
        else if(result.length == 0 && result !== undefined) {
          return res.send({errorMessage: "No results matched your search.  Try different search parameters."})
        }
        else {
          //Send the result logs as json
          return res.json({userData: {exerciseLogs: result}, skip: skip, totalResults: totalResults, prevResults: prevResults});
        }
      })
    }
    
   
    //Else if there is no errors or date range:
    else {

      // Get count of logs based on date search criteria without limit
      Log.find({uid: userId}).countDocuments((err, count) => {
        if (err) {
          console.log(err);
        }
        //console.log(count, "total count");
        totalResults = count;
      });
      //Send the complete user object as json
      //res.json({userData: user});
      //Update skip value based on current skip value total results prev results and limit.
        skip = calculateSkip(skip, limit, totalResults, prevResults)
        //reset prevResults flag
        prevResults = false;

      Log.find({uid: userId})
      .limit(limit)
      .skip(skip)
      .exec((err,result) => {
        if(err) {
          return res.send({errorMessage: err.message});
        }
        //Send an error message if there are no results
        else if(result.length == 0 && result !== undefined) {
          return res.send({errorMessage: "No results matched your search.  Try different search parameters."})
        }
        else {
          //Send the result logs as json
          return res.json( { userData: {exerciseLogs: result}, skip: skip, totalResults: totalResults, prevResults: prevResults });
        }
      })
    }
}

