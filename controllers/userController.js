const { body,validationResult, check } = require('express-validator');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs');
var User = require('../models/user');




/* Passport contrller */
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) { 
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user)
        } else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" })
        }
      })
    });
  })
);



passport.serializeUser(function(user, done) {
done(null, user.id);
});

passport.deserializeUser(function(id, done) {
User.findById(id, function(err, user) {
  done(err, user);
});
});

/* end passport controlelr */







exports.user_create_get = function(req,res){
    res.render("signup_form", {title: "Please Sign Up"});
};


exports.user_create_post = [

    // Validate and sanitise fields.
    body('firstname','First Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('lastname', 'Last Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('username', 'category must not be empty.').trim().isLength({ min: 1 }).escape(),
    check('username', 'Username already exists in database').exists()
    .custom((value, {req}) => {
      return new Promise((resolve, reject) => {
        User.find({username: req.body.username})
        .exec(function(err, result){
          if(err){reject(new Error('server error'))}
          if(result.length>0){
            reject(new Error('Username already in use'))
          }
          resolve(true)
        });
      });
    }),

    check('password').exists(),
    check(
      'passwordconf',
      'passwordConfirmation field must have the same value as the password field',
    )
      .exists()
      .custom((value, { req }) => value === req.body.password),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/error messages.
          res.render('signup_form', {title: 'Sign Up Failed', errors: errors.array()})
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
                  res.redirect("/clubhouse/log-in");
                });
              });
          }
        



    }
];


    


// do login below this 
exports.login_get = function(req,res) {
  res.render('login_form', {title: "Please Log In"});
};

exports.login_post = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/clubhouse/sign-up"
});



// do logout here
exports.logout_get = function(req,res){
  req.logout();
  res.redirect("/");
}

