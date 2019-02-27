let express = require('express')
let router = express.Router()
let controllers = require('./mongoose/controllers')



//Root route that displays html file from views folder
//router.get('/', controllers.get_html);


//Create post route that creates new user with submitted data
router.post("/api/exercise/new-user", controllers.post_user);

//Post route for when a user submits exercise entry form data
router.post("/api/exercise/add", controllers.post_exercise);

//Route that displays all users in the database
router.get("/api/exercise/users", controllers.get_users);

module.exports = router