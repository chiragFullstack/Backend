const express=require('express');
const router=express.Router();
const{getStaffAttendenceReport}=require('../../Controller/staffAttendece');
router.get('/staffAttendenceReport',getStaffAttendenceReport);
module.exports=router;