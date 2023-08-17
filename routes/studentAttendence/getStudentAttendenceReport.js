const express=require('express');
const router=express.Router();
const{getStudentAttendenceReport}=require('../../Controller/studentAttendence');
router.get('/studentAttendenceReport',getStudentAttendenceReport);
module.exports=router;