const express=require('express');
const router=express.Router();
const{addSchool}=require('../../Controller/school');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/addSchool',upload.single('logo'),addSchool);
module.exports=router;