const express=require('express');
const router=express.Router();
const{studentCheckOut}=require('../../Controller/studentAttendence');


const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/studentCheckOut',upload.none(),studentCheckOut);
module.exports=router;