const cors = require('cors');
let express = require('express');
let router = express.Router();
const bodyParser = require('body-parser');
//Express Middleware:

//Enable cors for cross site requests
router.use(cors())

// Include bodyparser middleware for parsing message body in form posts
router.use(bodyParser.urlencoded({extended: true}))
router.use(bodyParser.json())

//Use public folder to allow using public folderand its css file
//router.use(express.static('public'));
//Use views folder and its html file
//router.use(express.static('views'));

module.exports = router;