const express=require('express');
const router=express.Router();
const{getSingleStaffBySchoolId}=require('../../Controller/staffAttendece');
router.get('/getSingleStaffBySchoolId',getSingleStaffBySchoolId);
module.exports=router;