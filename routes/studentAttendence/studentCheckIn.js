const express=require('express');
const router=express.Router();
const{studentCheckIn}=require('../../Controller/studentAttendence');


const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/studentCheckIn',upload.none(),studentCheckIn);
module.exports=router;