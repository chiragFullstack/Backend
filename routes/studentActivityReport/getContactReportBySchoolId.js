const express=require('express');
const router=express.Router();

const{getContactReportBySchoolId}=require('../../Controller/studentReport');

router.get('/getContactReportBySchoolId',getContactReportBySchoolId);
module.exports=router;