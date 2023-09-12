const express=require('express');
const router=express.Router();
const{chkLogin}=require('../../Controller/login');


const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/checkLogin',upload.none(),chkLogin);

module.exports=router;











