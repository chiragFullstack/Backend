const express=require('express');
const router=express.Router();
const{staffCheckIn}=require('../../Controller/staffAttendece');


const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/staffCheckIn',upload.none(),staffCheckIn);
module.exports=router;