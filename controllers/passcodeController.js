var User = require('../models/user');


exports.passcode_get = function(req, res){
    res.render("passcode_form")
}


exports.passcode_post = function(req, res){
    if(req.body.passcode===process.env.PASSCODE){
        User.findByIdAndUpdate(req.user.id, {$set: {member: true}}, {}, function(err){
            if (err) {return next(err)}
            //success
            res.redirect('/clubhouse/create-message')
        } )
    }
    else if (req.body.passcode !== process.env.PASSCODE){
        res.render("passcode_form", {error: "Please try again - wrong passcode" });
        return;
    }
}