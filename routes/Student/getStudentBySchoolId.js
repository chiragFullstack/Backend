const express=require('express');
const router=express.Router();
const{getStudentBySchoolId}=require('../../Controller/student');
router.get('/getStudentBySchoolId',getStudentBySchoolId);
module.exports=router;