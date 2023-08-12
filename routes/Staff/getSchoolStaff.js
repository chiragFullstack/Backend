const express=require('express');
const router=express.Router();
const{getSchoolStaff}=require('../../Controller/Staff');
router.get('/getSchoolStaff',getSchoolStaff);
module.exports=router;