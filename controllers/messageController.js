var User = require('../models/message');


exports.message_list = function(req,res){
    res.render('message_list', {title: "Messages"});
};