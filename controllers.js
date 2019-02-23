let User = require('./models');

exports.post_user = (req, res) => {
    let userInput = req.body.username;
    let newUser = new User({username: userInput});
    newUser.save(function(err, newUser) {
      if(err) {
        console.log(err);
      }
      else {
        res.send({userId: newUser._id})
      }  
    });  
}

exports.get_html = (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
}