const express = require("express");
const User = require("../models/user");
const Bed = require("../models/bed");
const router = express.Router();          
//const bcrypt = require("bcryptjs");    
const mongoose = require("mongoose");
const multer = require("multer");
const upload = multer({dest : 'uploads/', limits: { filesize: 100 * 1024 * 1024}});

/*
1. 모델 폴더에 스키마 정의
2. 해당 스크립트에 정의한 스키마를 변수로 선언
3. 몽고DB model을 가져오기 위해 var 변수명 = mongoose.model('변수명', 정의한 스키마); 를 선언
4. 3번에서 정의한 변수명으로 쿼리문 사용
*/

router.post("/sign_up", async (req, res) => { //회원가입

    console.log(req.body);

    try { // id 비교
        usrid = req.body.userid
     
        let user = await User.findOne({ id: usrid });

        const re = {
            code: 400,
            msg: '유저 중복'
        };

        if (user) {
            console.log(user);
            return res.send(re);
        }
        /*
        const salt = await bcrypt.genSalt(10);
        usrpw = await bcrypt.hash(usrpw, salt);
        */
        user = new User({
        id : req.body.userid,
        password : req.body.userpw,
        phone_number : req.body.userph,
        gender : '0',
        birth: '0',
        height: '0',
        weight: '0',
        sleeptime: '0',
        wakeuptime: '0',
        sickness: '0',
        satisfaction: '0',
        serialnum : req.body.serialnum,
        name : req.body.name
        });

        const saveUser=await user.save();
        const r1 = {
            code: 200,
            msg: 'sucess'
        };
        res.send(r1);
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

router.post("/sign_in", async (req, res) => { //로그인

    User.findOne({ id: req.body.userid, password: req.body.userpw }, (err,user) => {
        if (err){
            const result123 = {
                code: 100,
                msg: 'server nodt'
            };
            res.send(result123);
            const result = {
                code: 500,
                msg: 'server error'
            };
            res.send(result);
        }
        else if(user){
            const r1 = {
                code: 200,
                msg: 'sucess',
                serialnum : user.serialnum,
                name : user.name
            };
            res.send(r1);
        }
        else{
            const re = {
                code: 400,
                msg: 'data null'
            };
            res.send(re);
        }
    });
    /*
    var Usr_model = mongoose.model('User', User); // 'User'는 데이터베이스 이름, User_model은 class 이름 -> 클래스 정의

    Usr_model.findOne({ id: req.body.id, password: req.body.password }, (err,user) => {
        if (err){
            const result = {
                code: 500,
                msg: 'server error'
            };
            res.send(result);
        }
        else if(user){
            const r1 = {
                code: 200,
                msg: 'sucess'
            };
            res.send(r1);
        }
        else{
            const re = {
                code: 400,
                msg: '유저 중복'
            };
            res.send(re);
        }
    });
    */
});

router.post("/information", async (req, res) => { //인포메이션 찾기
   
    console.log(req.body);

    try { // id 비교
        let info = await Information.find({serialmun : req.body.serialnum})
       
        const r1 = {
            code: 200,
            msg: 'sucess'
        };
        res.send(r1);
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

router.post("/survey", async (req, res) => { //설문조사
   
    console.log(req.body);

    try { // id 비교
        serial = req.body.serialnum

        //let user = await User.findOne({ serial });
       
        let user = await User.update({serialnum : serial }, {
        $set: {
            gender : req.body.gender,
            birth: req.body.birth,
            height: req.body.height,
            weight: req.body.weight,
            sleeptime: req.body.sleeptime,
            wakeuptime: req.body.wakeuptime,
            sickness: req.body.sickness,
            satisfaction:req.body.satisfaction
        }
        });

        const r1 = {
            code: 200,
            msg: 'sucess'
        };
        res.send(r1);
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

router.post("/pw_1", async (req, res) => { //비밀번호 찾기 (확인하는단계)
    User.findOne({ id: req.body.id, phone_number: req.body.ph }, (err,user) => {
        if (err){
            const result = {
                code: 500,
                msg: 'server error'
            };
            res.send(result);
        }
        else if(user){
            const r1 = {
                code: 200,
                msg: 'sucess'
            };
            res.send(r1);
        }
        else{
            const re = {
                code: 400,
                msg: 'data null'
            };
            res.send(re);
        }
    });
});

router.post("/pw_2", async (req, res) => { //비밀번호 찾기(비밀번호 수정하는 단계)
    try { // id 비교
        serial = req.body.serialnum

        //let user = await User.findOne({ serial });
       
        let user = await User.update({serialnum : serial }, {
        $set: {
            password : req.body.pw
        }
        });

        const r1 = {
            code: 200,
            msg: 'sucess'
        };
        res.send(r1);
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

router.post("/sleep_check", async (req, res) => {
    try { // id 비교
        serial = req.body.serialnum

        let toady = new Date(); // 현재 시간 구하는 함수
        let cur_time = today.getDate.toLocaleString();
        let timest = + new Date();
        let bed = await Bed.findOne({ serialnum: serial, msg: "sleep" }).sort({"_id":-1}).limit(1);
        
        if(bed == NULL){
            let tmp = 1;

            bed = new Bed({
            time : current_time,
            msg : "sleep",
            sleep_seq: tmp,
            timestamp : timest
            });
   
            const saveUser=await user.save();
            const r1 = {
                code: 200,
                msg: 'sucess'
            };
            res.send(r1);
        }
        else{
            tmp = bed.sleep_seq + 1; //전 날 수면체크 + 1

            bed = new Bed({
                time : current_time,
                msg : "sleep",
                sleep_seq: tmp,
                timestamp : timest
                });
   
            const saveUser=await user.save();
            const r1 = {
                code: 200,
                msg: 'sucess'
            };
            res.send(r1);
        }

       
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

router.post("/wake_up_check", async (req, res) => {
    try { // id 비교
        serial = req.body.serialnum

        let toady = new Date(); // 현재 시간 구하는 함수
        let cur_time = today.getDate.toLocaleString();
        let timest = + new Date();
        let bed = await Bed.findOne({ serialnum: serial, msg: "wake" }).sort({"_id":-1}).limit(1);

        if(bed == NULL){
            let tmp = 1;

            bed = new Bed({
            time : current_time,
            msg : "wake",
            wake_seq: tmp,
            timestamp : timest
            });
   
            const saveUser=await user.save();
            const r1 = {
                code: 200,
                msg: 'sucess'
            };
            res.send(r1);
        }
        else{
            tmp = bed.wake_seq + 1; //전 날 수면체크 + 1

            bed = new Bed({
                time : current_time,
                msg : "wake",
                wake_seq: tmp,
                timestamp : timest
                });
   
            const saveUser=await user.save();
            const r1 = {
                code: 200,
                msg: 'sucess'
            };
            res.send(r1);
        }

       
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
/*
router.post("/today_sleep", async (req, res) => {
    try { // id 비교
        serial = req.body.serialnum

        let bed = await Bed.findOne({ bed_시리얼넘: serial });

        tmp1 = bed.sleep_seq;
        tmp2 = bed.wake_up_seq;
        // 두 개의 seq는 값이 같아지도록 관리되어야 한다 -> 예외처리 해야 함
        // 기상 시간 저장 시 wake_up_seq가 sleep_seq와 다르다면 예외처리 하기
       








       

        if (tmp1 == tmp2){
            //tmp1과 tmp2 사이의 값 query
        }
        else if(tmp1 > tmp2){
            tmp1 --;
            if (tmp1 == tmp2){
                //tmp1과 tmp2 사이 값 query
            }
            else{
                const result = {
                    code: 501,
                    msg: 'data error'
                };
                res.send(result);
            }    
        }
        else{
            const result = {
                code: 501,
                msg: 'data error'
            };
            res.send(result);
        }

        const r1 = {
            code: 200,
            msg: 'sucess'
        };
        res.send(r1);
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
*/
router.post('/test', upload.array('file'), (req, res) => { //현준이랑 file 송수신 테스트
    console.log(req.body);
    console.log(req.files);
    res.send("hi");
});


module.exports = router;