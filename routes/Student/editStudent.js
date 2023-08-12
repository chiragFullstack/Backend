const express=require('express');
const router=express.Router();


const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const{editStudent}=require('../../Controller/student');

router.put('/editStudent',upload.single('logo'),editStudent);

module.exports=router;