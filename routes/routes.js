let express = require('express')
let router = express.Router()
let controllers = require('./mongoose/controllers')


//Create post route that creates new user with submitted data
router.post("/api/exercise/new-user", controllers.post_user);

//Post route for when a user submits exercise entry form data
router.post("/api/exercise/add", controllers.post_exercise);

//Route that displays all users in the database
router.post("/api/exercise/users", controllers.get_users);

//Route that displays exercise logs for a specific user
router.post("/api/exercise/log", controllers.get_user_exercise_log);

module.exports = router