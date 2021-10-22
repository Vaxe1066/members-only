const { body,validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var User = require('../models/User');



exports.user_create_get = function(req,res){
    res.render("sign_up", {title: "Please Sign Up"});
};


exports.user_create_post = [

    // Validate and sanitise fields.
    body('firstname','First Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('lastname', 'Last Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('username', 'category must not be empty.').trim().isLength({ min: 1 }).escape(),
    //body('password', 'price must not be empty').trim().isLength({ min: 6 }).escape(),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            res.render('sign_up', {title: 'Sign Up Failed', errors: errors.array()})
            return;
        }
        else {
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                const user = new User({
                  first_name: req.body.firstName,
                  last_name: req.body.lastName,
                  username: req.body.username,
                  password: hashedPassword,
                  member: 0
                }).save(err => {
                  if (err) { 
                    return next(err);
                  }
                  res.redirect("/");
                });
              });
        }
    }
];


    
