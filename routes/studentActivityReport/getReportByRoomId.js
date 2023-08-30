const express=require('express');
const router=express.Router();

const{getReportByRoomId}=require('../../Controller/studentReport');

router.get('/getReportByRoomId',getReportByRoomId);
module.exports=router;