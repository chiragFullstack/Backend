const express=require('express');
const router=express.Router();

const{getReportByParentId}=require('../../Controller/studentReport');

router.get('/getReportByParentId',getReportByParentId);
module.exports=router;