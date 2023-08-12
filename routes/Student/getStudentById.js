const express=require('express');
const router=express.Router();
const{getStudentById}=require('../../Controller/student');
router.get('/getStudentById',getStudentById);
module.exports=router;