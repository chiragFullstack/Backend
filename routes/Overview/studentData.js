const express=require('express');
const router=express.Router();
const{getStudents}=require('../../Controller/dashboard');
router.get('/studentData',getStudents);
module.exports=router;