const express=require('express');
const router=express.Router();
const{getStaffStatus}=require('../../Controller/staffAttendece');
router.get('/getStaffAttendence',getStaffStatus);
module.exports=router;