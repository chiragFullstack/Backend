const express=require('express');
const router=express.Router();
const{deleteNoticeBySchool}=require('../../Controller/notice');
router.delete('/deleteNoticeBySchool',deleteNoticeBySchool);

module.exports=router;