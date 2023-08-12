const express=require('express');
const router=express.Router();
const{editNotice}=require('../../Controller/notice');


const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.put('/editNotice',upload.none(),editNotice);
module.exports=router;