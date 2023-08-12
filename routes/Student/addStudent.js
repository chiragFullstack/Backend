const express=require('express');
const router=express.Router();


const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const{addStudent}=require('../../Controller/student');
router.post('/addStudent',upload.single('logo'),addStudent);

module.exports=router;