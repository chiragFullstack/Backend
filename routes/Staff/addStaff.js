const express=require('express');
const router=express.Router();
const{addStaff}=require('../../Controller/Staff');


const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/addStaff',upload.single('picUrl'),addStaff);
module.exports=router;