const { body,validationResult, check } = require('express-validator');
var Message = require('../models/message');
var User = require('../models/user');

var async = require('async');


exports.message_list = function(req,res,next){
    Message.find()
    .populate('user')
    .exec(function(err, results){
        if(err) {return next(err)};
        //on success
        res.render('message_list', {title: "Messages", user: req.user, messages: results});
    })

};

//create new message get request
exports.create_message_get = function(req,res,next){
    User.find({username: req.user.username})
    .exec(function (err, result){
        if(err) {return next(err)}
        //on success of find
        else if(result[0].member===false){
            res.redirect('/clubhouse/passcode')
            return;
        }
        else if (result[0].member===true){
            res.render('message_form', {title: "Add New Message", user: req.user});
            return;
        }
    })
}

//create new message post request
exports.create_message_post = [

    // Validate and sanitise fields.
    body('title','Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('message', 'Message must not be empty.').trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        //find if user name exists in database

        if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.
        res.render('message_form', {title: 'Message Upload Failed', errors: errors.array()})
        return;
        }
        else {
            const message = new Message({
            title: req.body.title,
            message: req.body.message,
            timestamp: Date.now(),
            user: req.user.id
            }).save(err => {
            if (err) { 
                return next(err);
            }
            res.redirect("/");
            });
        }




    }
];



// delete messages 

exports.delete_message_get = function(req,res,err) {
    Message.findById(req.params.id)
    .exec(function(err, results){
        if(err) {return next(err)}
        //success
        res.render("message_delete", {title: results._id, message: results})
    })
}


exports.delete_message_post = function(req,res,next) {
    Message.findByIdAndDelete(req.params.id)
    .exec(function(err, result){
        if(err) {return next(err)}
        //success
        res.redirect('/')
    })
}