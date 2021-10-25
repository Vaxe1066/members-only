const { DateTime } = require("luxon");
const mongoose = require('mongoose');

const Schema=mongoose.Schema;

const MessageSchema = new Schema(
    {
        title: {type: String, required: true, maxLength: 200},
        message: {type: String, required: true, maxLength: 200},
        timestamp: {type: Date, default:Date.now},
        user: {type: Schema.Types.ObjectID, ref:'User'}

    }
);


MessageSchema
.virtual('url')
.get(function () {
    return this._id;
});


MessageSchema
.virtual('timestamp_formatted')
.get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Message', MessageSchema);