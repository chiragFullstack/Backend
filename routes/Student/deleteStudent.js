const express=require('express');
const router=express.Router();
const{deleteStudent}=require('../../Controller/student');
router.delete('/deleteStudent',deleteStudent);
module.exports=router;