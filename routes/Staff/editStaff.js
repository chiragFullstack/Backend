const express=require('express');
const router=express.Router();
const{editStaff}=require('../../Controller/Staff');


const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put('/editStaff',upload.none(),editStaff);
module.exports=router;