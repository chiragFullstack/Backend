const express=require('express');
const router=express.Router();
const{editSchool}=require('../../Controller/school');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put('/editSchool',upload.single('logo'),editSchool);

module.exports=router;