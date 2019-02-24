let User = require('./models');

//Create first test user
let userTim = new User({
    username: "Timothy",
});



//Save the userTim document
exports.createTim = userTim.save(function (err, userTim) {
    if (err) {
        console.log(err);
    }
    console.log('Timothy created: ', userTim._id);
});
