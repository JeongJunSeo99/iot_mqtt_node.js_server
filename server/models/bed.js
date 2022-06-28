const mongoose = require("mongoose");

const BedSchema = new mongoose.Schema({
time: {
    type: String,
    required: true
},
timestamp: {
    type: Number,
    required: true,
    unique : true
},
msg: {
    type: String,
    required: true
},
wake_seq: {
    type: Number
},
sleep_seq: {
    type: Number
}
});

module.exports = Bed = mongoose.model("bed", BedSchema);