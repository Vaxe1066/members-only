const mongoose = require('mongoose');

const Schema=mongoose.Schema;

const UserSchema = new Schema(
    {
        first_name: {type: String, maxLength: 200},
        last_name: {type: String, maxLength: 200},
        username: {type: String, required: true, maxLength: 100},
        password: {type: String, required: true},
        member: {type: Boolean, enum: [0,1], default: 0}

    }
);


UserSchema
.virtual('userid')
.get(function () {
    return this._id;
});

//virtual for full name 
UserSchema
.virtual('fullName')
.get(function () {
    return this.last_name + ', ' +this.first_name;
});


module.exports = mongoose.model('User', UserSchema);