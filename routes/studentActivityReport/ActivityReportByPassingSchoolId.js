const express=require('express');
const router=express.Router();

const{getFullReportBySchoolId}=require('../../Controller/studentReport');

router.get('/getFullReportBySchoolId',getFullReportBySchoolId);
module.exports=router;