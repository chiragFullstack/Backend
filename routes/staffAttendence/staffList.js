const express=require('express');
const router=express.Router();
const{getStaffListBySchoolId}=require('../../Controller/staffAttendece');
router.get('/getStaffListBySchoolId',getStaffListBySchoolId);
module.exports=router;