const express=require('express');
const router=express.Router();
const{getNoticeListBySchool}=require('../../Controller/notice');

router.get('/allNoticeBySchoolId',getNoticeListBySchool);
module.exports=router;