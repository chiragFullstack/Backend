const express=require('express');
const router=express.Router();
const{getStaffStatus}=require('../../Controller/staffAttendece');
router.get('/staffStatus',getStaffStatus);
module.exports=router;