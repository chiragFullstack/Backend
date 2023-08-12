const express=require('express');
const router=express.Router();
const{addNotice}=require('../../Controller/notice');


const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post('/addNotice',upload.none(),addNotice);
module.exports=router;