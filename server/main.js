var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
//var api = require('./routes/index');
var Motion_bed=require("./models/motion_bed");
var Enviroment_data=require("./models/enviroment_data");
var Pose_data=require("./models/pose_data");
var Snore_data=require("./models/snore_data");
var Bed_data=require("./models/bed_data");
var Mat_data=require("./models/mat_data");
var Ack_data=require("./models/ack_data");
var Control=require("./models/control");
var mqtt=require('mqtt');
var moment = require('moment');
var client =mqtt.connect('mqtt://220.149.244.199:1833');
var MH_sn;
const { PythonShell }= require("python-shell");
const schedule = require('node-schedule');

// conncet to mqtt broker server and subscribe mqtt topic(topic_list) 
const topic_list=['connect','env_data/+',
'pose_data/+','snore_data/+', 'bed_data/+', 
'mat_data/+', 'ack/+','command/+'];

client.on('connect',()=>{
    client.subscribe(topic_list);
    console.log('connected mqtt broker server')
    });
 
client.on('message', async (topic,message)=>{
    
    if(topic==='connect'){
        var data=JSON.parse(message);
        console.log(data);
        MH_sn = data.mh_sn;
        let timestamp = + new Date();
        let today = new Date();
        let cur_time = today.toLocaleString();

        let motion_bed = Motion_bed({
            mh_sn : data.mh_sn,
            time : timestamp
        });

        var connect_control = 'command/' + MH_sn;

        server_time = {
            "command_type" : "2",
            "time" : timestamp
        };
        client.publish(connect_control, JSON.stringify(server_time));

        try{
            const saveMotion_bed=await motion_bed.save();
            console.log("insert OK");
            console.log(MH_sn);
            }
            catch(err){
            console.log({message:err});
            }
    }
    
    var env_t= 'env_data/' + MH_sn;    

    if(topic===env_t){
        var env_data= JSON.parse(message);
        console.log(env_data);
        let timestamp = + new Date();
        let today = new Date();
        let cur_time = today.toLocaleString();

        let e_d = Enviroment_data({
                mh_sn : env_data.mh_sn,
                ev_temp : env_data.ev_temp,
                ev_hum : env_data.ev_hum,
                ev_co2 : env_data.ev_co2,
                time : timestamp
                
            });

        try{
            const saveEnviroment_data=await e_d.save();
            //console.log("Enviroment data insert OK");
            }
            catch(err){
            console.log({message:err});
            }
    }

    var pose_t= 'pose_data/' + MH_sn;

    if(topic===pose_t){
        var pose_data= JSON.parse(message);
        console.log(pose_data);
        let timestamp = + new Date();
        let today = new Date();
        let cur_time = today.toLocaleString();

        let p_d = Pose_data({
            mh_sn : pose_data.mn_sn,
            pitch_angle : pose_data.pitch_angle,
            roll_angle : pose_data.roll_angle,
            pose_type : pose_data.pose_type,
            time : timestamp
        });

        try{
            const savePose_data=await p_d.save();
            //console.log("Pose data insert OK");
            //console.log(env_t);
            }
            catch(err){
            console.log({message:err});
            }
    }

    var snore_t= 'snore_data/' + MH_sn;

    if(topic===snore_t){
        var snore_data= JSON.parse(message);
        console.log(snore_data);
        let today = new Date();
        let cur_time = today.toLocaleString();
        let timestamp = + new Date();
        let s_d = Snore_data({
            mh_sn : snore_data.mh_sn,
            snore_db : snore_data.snore_db,
            time : timestamp
        });

        try{
            const saveSnore_data=await s_d.save();
            //console.log("Snore data insert OK");
            }
            catch(err){
            console.log({message:err});
            }
    }

    var bed_t= 'bed_data/' + MH_sn;

    if(topic===bed_t){
        
        var bed_data= JSON.parse(message);
        
        console.log(bed_data);
        
        let today = new Date();
        let cur_time = today.toLocaleString();
        let timestamp = + new Date();
        let b_d = Bed_data({
            mh_sn : bed_data.mh_sn,
            head_count : bed_data.head_count,
            foot_count : bed_data.foot_count,
            time : timestamp,
            bed_status : bed_data.bed_status
        });

        try{
            const saveBed_data=await b_d.save();
            //console.log("Bed data insert OK");
            //console.log(pose_t);
            }
            catch(err){
            console.log({message:err});
            }
    }

    var mat_t= 'mat_data/' + MH_sn;

    if(topic===mat_t){
        var mat_data= JSON.parse(message);
        console.log(mat_data);
        let today = new Date();
        let cur_time = today.toLocaleString();
        let timestamp = + new Date();
        let m_d = Mat_data({
            mh_sn : mat_data.mh_sn,
            current_temp : mat_data.current_temp,
            setting_temp : mat_data.setting_temp,
            off_time : mat_data.off_time,
            on_time : mat_data.on_time,
            mode : mat_data.mode,
            mat_status : mat_data.mat_status,
            time : timestamp,
            cmd_no : mat_data.cmd_no       
        });

        try{
            const saveMat_data=await m_d.save();
            //console.log("Mat data insert OK");
            }
            catch(err){
            console.log({message:err});
            }
    }

    var ack_t= 'ack/' + MH_sn;

    if(topic===ack_t){
        var A= JSON.parse(message);

        let a_d = Ack_data({
            command_type : A.command_type,
            error_type : A.error_type,
            cmd_no : A.cmd_no        
        });

        try{
            const saveAck_data=await a_d.save();
            //console.log("Ack insert OK");
            }
            catch(err){
            console.log({message:err});
            }
    }
    var c_t= 'command/' + MH_sn;

    if(topic ===c_t ){
        var a = JSON.parse(message);
        console.log(a);
    }

    /*
    buf_e={
        "command_type" : "1"
    }
    moment.tz.setDefault("Asia/Seoul"); 
    var date = moment().format('YYYY-MM-DD HH:mm:ss');

    buf_f={
        "command_type" : "2",
        "time" : date
    }

    var co_t= 'command/' + MH_sn;
    var co__co_t= 'command/' + MH_sn + 'common';


    client.on('connect',function(){
        client.subscribe(co_t);
        client.publish(co_t,JSON.stringify(buf_e));
        });
    client.on('connect',function(){
        client.subscribe(co_co_t);
        client.publish(co_co_t,JSON.stringify(buf_e));
        });
        */
});

//conncet to mongodb server
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
console.log('connected mongodb server!');
});
mongoose.connect('mongodb://localhost/Medex');
const port = 3001;

//bodyParser setting
app.use(bodyParser.urlencoded({
extended: true
}));
app.use(bodyParser.json());
//app.use(express.json({extended : false}));
//app.use(express.urlencoded({extended:true}));
//app.use('/api', api);
app.use("/app_list", require("./routes/app_list"));
app.listen(port, () => {
console.log('Express is listening on port', port);
});

let options = {
    args: "100"
};
/*
PythonShell.run("./test.py", options, function(err, data) {
    if (err) throw err;
    console.log(data);
  });
*/

/*
Enviroment_data.find(function(err, a){
    if(err){
        console.log(err);
    }
    else{
        console.log(a);
        /*
        //console.log(a);
        let options = {
            args: [a]
        };
        PythonShell.run("./test.py", options, function(err, data) {
            if (err) throw err;
            console.log(data);
        });
        
    }
});
*/

app.post("/angle", async (req, res) => {

    console.log(req.body);

    try {
       
        sid = req.body.serialnum
        let today = new Date();
        let cur_time = today.toLocaleString();
      /*
        let today = new Date();
        let cur_time = today.toLocaleString();
        let control = await control.findOne({ serialnum: sid }); // control table 필요
        let timestamp = + new Date();
        control = new Control({
            command_type : "4",
            mh_sn : sid,
            head_count : req.body.head_count,
            foot_count : req.body.foot_count,
            time : timestamp,
            function_mode : "?" //function mode 처리 부분이 어디인지
        });

        const saveControl=await control.save();
        const r1 = {
            code: 200,
            msg: 'sucess'
        };
        res.send(r1);
*/
        var options = {
            qos:1
        };
        var bed_control = 'command/' + sid;
        var bed_control1 = '/command/' + sid;
        var a = 4;
        var b = 1000;
        var c = 0;
        var d = 1;

        var msg = req.body.btnnum;
        //console.log(msg)
        
        var head_count= 0;
        var leg_count=0;

        if(msg== "headup" ){
            let control = await Control.findOne({ serial: sid, msg: "head" }).sort({"_id":-1}).limit(1);
            if(control){
                head_count = control.head_count + 10;
                control = new Control({
                    time: cur_time,
                    msg: "head",
                    head_count: head_count,
                    serial : sid
                });
                const saveControl=await control.save();
            }
            else{
                head_count = 10;
                control = new Control({
                    time: cur_time,
                    msg: "head",
                    head_count: head_count,
                    serial : sid
                });
                const saveControl=await control.save();
            }
            
        }
        else if(msg == "headdown"){
            let control = await Control.findOne({ serial: sid, msg: "head" }).sort({"_id":-1}).limit(1);
            if(control){
                if(control.head_count >=10){
                    head_count = control.head_count - 10;
                    control = new Control({
                        time: cur_time,
                        msg: "head",
                        head_count: head_count,
                        serial : sid
                    });
                    const saveControl=await control.save();
                }
                else{
                    head_count = 0;
                    control = new Control({
                        time: cur_time,
                        msg: "head",
                        head_count: head_count,
                        serial : sid
                    });
                    const saveControl=await control.save();
                }
            }
            else{
                head_count = 0;
                control = new Control({
                    time: cur_time,
                    msg: "head",
                    head_count: head_count,
                    serial : sid
                });
                const saveControl=await control.save();
            }
            
        
        }
        else if(msg == "legup"){
            let control = await Control.findOne({ serial: sid, msg: "leg" }).sort({"_id":-1}).limit(1);
            if(control){
                leg_count = control.leg_count + 10;
                control = new Control({
                    time: cur_time,
                    msg: "leg",
                    leg_count: leg_count,
                    serial : sid
                });
                const saveControl=await control.save();
            }
            else{
                leg_count = 10;
                control = new Control({
                    time: cur_time,
                    msg: "leg",
                    leg_count: leg_count,
                    serial : sid
                });
                const saveControl=await control.save();
            }
            
        }
        else if(msg == "legdown"){
            let control = await Control.findOne({ serial: sid, msg: "leg" }).sort({"_id":-1}).limit(1);
            if(control){
                if(control.leg_count >=10){
                    leg_count = control.leg_count - 10;
                    control = new Control({
                        time: cur_time,
                        msg: "leg",
                        leg_count: leg_count,
                        serial : sid
                    });
                    const saveControl=await control.save();
                }
                else{
                    leg_count = 0;
                    control = new Control({
                        time: cur_time,
                        msg: "leg",
                        leg_count: leg_count,
                        serial : sid
                    });
                    const saveControl=await control.save();
                }
            }
            else{
                leg_count = 0;
                control = new Control({
                    time: cur_time,
                    msg: "leg",
                    leg_count: leg_count,
                    serial : sid
                });
                const saveControl=await control.save();
            }
            
        }

        bed_c = {
            "function_mode" : d,
            "command_type" :a,
            "mh_sn" : sid,
            "head_count" : head_count,
            //"count" : 100
            "foot_count" : leg_count
        };


        
        
        console.log(bed_c)
        
        //client.publish(bed_control,JSON.stringify(bed_c));
        client.publish(bed_control,JSON.stringify(bed_c),options);
        //client.publish('common/H10000000000',JSON.stringify(bed_c),options);
        //client.publish('common',JSON.stringify(bed_c),options);

        
        //client.publish(bed_control1, JSON.stringify(bed_c));
        res.send("sucess");
    }
    catch (error) {
        console.error(error.message);
        const result = {
            code: 500,
            msg: 'server error'
        };
        res.send(result);
    }
});

app.post("/mat", async (req, res) => {

    console.log(req.body);

    try {
       
        sid = req.body.serialnum
      /*
        let today = new Date();
        let cur_time = today.toLocaleString();
        let control = await control.findOne({ serialnum: sid }); // control table 필요
        let timestamp = + new Date();
        control = new Control({
            command_type : "4",
            mh_sn : sid,
            head_count : req.body.head_count,
            foot_count : req.body.foot_count,
            time : timestamp,
            function_mode : "?" //function mode 처리 부분이 어디인지
        });

        const saveControl=await control.save();
        const r1 = {
            code: 200,
            msg: 'sucess'
        };
        res.send(r1);
*/
        var options = {
            qos:1
        };
        var bed_control = 'command/' + sid;

        var a = 4;
        var b = 1000;
        var c = 0;
        var d = 1;

        //var msg = req.body.btnnum;
        //console.log(msg)

        mat_c = {
            "command_type" :5,
            "mh_sn" : sid,
            "mat_command" : 3
        };

        console.log(mat_c)
        
        //client.publish(bed_control,JSON.stringify(bed_c));
        client.publish(bed_control,JSON.stringify(mat_c),options);
        //client.publish('common/H10000000000',JSON.stringify(bed_c),options);
        //client.publish('common',JSON.stringify(bed_c),options);

        
        //client.publish(bed_control1, JSON.stringify(bed_c));
        res.send("sucess");
    }
    catch (error) {
        console.error(error.message);
        const result = {
            code: 500,
            msg: 'server error'
        };
        res.send(result);
    }
});

app.post('/', function(req, res, next) {
    res.send("Hi");
    console.log("HI");
});

const j = schedule.scheduleJob('00 18 * * *', function(){
    console.log('매 03hour에 실행');
});

/*
let options = {
    scriptPath: '/home/hadoop/Desktop/Medex/server',
    args: ['value1', 'value2', 'value3']/home/hadoop/Desktop/Medex/server
  };

let pyshell = new PythonShell('test.py', options)

Enviroment_data.find(function(err, a){
    if(err){
        console.log(err);
    }
    else{
        pyshell.send('hello')
    }
});

pyshell.send('hello')

pyshell.on('msg', (msg) => {
	console.log(msg)
})
*/
/*
app.post('/device/post',(req, res) => {  
    req.on('data',(data)=>{
        input=JSON.parse(data);
    })
    var obj = JSON.parse(req.body);

    console.log(req.body);
    console.log(input);

    var app_control = 'control/' + input.serialnumber
    client.publish(app_control, input.control);
    
    let f_d = Feedback_data({
        time : input.time,
        control : input.control,      
    });

    try{
        const saveFeedback_data=await f_d.save();
        console.log("Ack insert OK");
        }
        catch(err){
        console.log({input:err});
        }
});

app.set("port", "3003");
var server = http.createServer(app);
var io = require("socket.io")(server);
io.on("connection", (socket)=> {
    socket.on("app server received name", (data)=>{
        var obj = JSON.parse(data);
        client.publish("topic_name", obj.led + "");
    });
});
*/