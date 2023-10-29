const express=require('express');
const router=express.Router();
const{attendanceCount}=require('../../Controller/dashboard');
router.get('/attendenceData',attendanceCount);
module.exports=router;