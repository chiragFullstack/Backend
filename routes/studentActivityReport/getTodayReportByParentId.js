const express=require('express');
const router=express.Router();

const{getTodayReportByParentId}=require('../../Controller/studentReport');

router.get('/getTodayReportByParentId',getTodayReportByParentId);
module.exports=router;