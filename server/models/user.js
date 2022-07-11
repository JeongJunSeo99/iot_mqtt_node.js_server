const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
id: {
    type: String,
    required: true,
    unique : true
},
phone_number: {
    type: String,
    required: true
},
birth: {
    type: Number,
    required: true
},
password: {
    type: String,
    required: true
},
gender: {
    type: String,
    required: true
},
weight: {
    type: Number,
    required: true
},
height: {
    type: Number,
    required: true
},
sleeptime: {
    type: Number,
    required: true
},
wakeuptime: {
    type: Number,
    required: true
},
sickness: {
    type: String,
    required: true
},
serialnum: {
    type: String,
    required: true
},
satisfaction: {
    type: Number,
    required: true
},
name: {
    type: String,
    required: true
},
});

module.exports = User = mongoose.model("user", UserSchema);