const express=require('express');
const router=express.Router();

const{getBirthReportBySchoolId}=require('../../Controller/studentReport');

router.get('/getBirthReportBySchoolId',getBirthReportBySchoolId);
module.exports=router;