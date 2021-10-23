var express = require('express');
var router = express.Router();
const path = require('path');

// Require controller modules.
var user_controller = require('../controllers/userController');
var message_controller = require('../controllers/messageController');
var passcode_controller = require('../controllers/passcodeController');


// GET app home page.
router.get('/', message_controller.message_list);

//messages routes

router.get('/create-message', message_controller.create_message_get);

router.post('/create-message', message_controller.create_message_post)



//users 

//get sign up form user 
router.get('/sign-up', user_controller.user_create_get);

//post sign up
router.post('/sign-up', user_controller.user_create_post);
module.exports = router;


//get log in form user
router.get('/log-in', user_controller.login_get);

//post log in 
router.post('/log-in', user_controller.login_post);


//log out get rquest 
router.get('/log-out', user_controller.logout_get);


//passcode route 
router.get('/passcode', passcode_controller.passcode_get);

router.post('/passcode', passcode_controller.passcode_post);