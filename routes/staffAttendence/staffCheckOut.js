const express=require('express');
const router=express.Router();
const{staffCheckOut}=require('../../Controller/staffAttendece');


const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/staffCheckOut',upload.none(),staffCheckOut);
module.exports=router;