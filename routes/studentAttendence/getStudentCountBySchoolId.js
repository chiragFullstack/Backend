const express=require('express');
const router=express.Router();
const{getStudentReportBySchoolId}=require('../../Controller/studentAttendence');
router.get('/studentAttendenceCount',getStudentReportBySchoolId);
module.exports=router;