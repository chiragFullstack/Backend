const express=require('express');
const router=express.Router();
const{getStudentStatus}=require('../../Controller/studentAttendence');
router.get('/studentStatus',getStudentStatus);
module.exports=router;