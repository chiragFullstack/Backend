const express=require('express');
const router=express.Router();

const{getReport}=require('../../Controller/studentReport');

router.get('/getDailyreport',getReport);
module.exports=router;