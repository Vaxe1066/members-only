var express = require('express');
var router = express.Router();
const path = require('path');

// Require controller modules.
var user_controller = require('../controllers/userController');
var message_controller = require('../controllers/messageController');


// GET app home page.
router.get('/', message_controller.message_list);



//users 

//get sign up form user 
router.get('/sign-up', user_controller.user_create_get);

//post sign up
router.post('/sign-up', user_controller.user_create_post);
module.exports = router;