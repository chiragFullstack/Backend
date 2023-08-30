const express=require('express');
const router=express.Router();

const{getFullReportByRoomId}=require('../../Controller/studentReport');

router.get('/getFullReportByRoomId',getFullReportByRoomId);
module.exports=router;