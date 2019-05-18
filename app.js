let User = require('./routes/mongoose/models/user.js');

//Create first test user
let userTim = new User({
    username: "Timothy",
});
