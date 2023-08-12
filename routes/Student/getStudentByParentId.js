const express=require('express');
const router=express.Router();
const{getStudentByparentId}=require('../../Controller/student');
router.get('/getStudentByparentId',getStudentByparentId);
module.exports=router;