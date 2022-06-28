var mongoose = require('mongoose');
 
const Snore_data = new mongoose.Schema({
    mh_sn : {type:String},
    snore_db : {type:Array},
    time : {type:Number}
})
 
module.exports = mongoose.model('snore_data',Snore_data);