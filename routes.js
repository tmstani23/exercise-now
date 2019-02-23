let express = require('express')
let router = express.Router()
let controllers = require('./controllers.js')
let User = require('./models');


//Root route that displays html file from views folder
router.get('/', controllers.get_html);


//Create post route that creates new user with submitted data
router.post("/api/exercise/new-user", controllers.post_user);

module.exports = router