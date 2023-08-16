const express=require('express');
const router=express.Router();

const{getReportByDate}=require('../../Controller/studentReport');

router.get('/getFullreport',getReportByDate);
module.exports=router;