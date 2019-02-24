let User = require('./models');

//Function that takes user form input as username and creates/saves a new user
exports.post_user = (req, res) => {
    let userInput = req.body.username;
    //Set new user instance of User model
    let newUser = new User({username: userInput});
    // Save the new user to the database
    newUser.save((err, newUser) => err ? console.log(err) : res.send({userId: newUser._id}));  
}

//Function that displays html file at route
exports.get_html = (req, res) => res.sendFile(__dirname + '/views/index.html');

//Function that displays all users in the database
exports.get_users = (req, res) => {
  // Find any user
  User.find({}, (err, users) => {
    if(err) {
      console.log(err);
    }
    let userArr = [];
    // Add each user to the user array
    users.forEach( user => userArr.push(user));
    //Return the user array at route
    res.send(userArr);
  }); 
}