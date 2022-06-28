var mongoose = require('mongoose');
 
const Mat_data = new mongoose.Schema({
    mh_sn : {type:String},
    current_temp : {type:Number, /*default, max, unique ... */},
    setting_temp : {type:Number},
    off_time : {type:Number},
    on_time : {type:Number},
    mode : {type:Number},
    mat_status:{type:Number},
    time : {type:Number},
    cmd_no : {type:String}
})
 
module.exports = mongoose.model('mat_data',Mat_data);