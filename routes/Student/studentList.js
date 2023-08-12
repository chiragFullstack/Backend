const express=require('express');
const router=express.Router();
const{getStudent}=require('../../Controller/student');


router.get('/studentlist',getStudent);
module.exports=router;