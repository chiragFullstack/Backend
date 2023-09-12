const express=require('express');
const router=express.Router();
const{getStaffReportBySchoolId}=require('../../Controller/staffAttendece');
router.get('/staffAttendenceCount',getStaffReportBySchoolId);
module.exports=router;