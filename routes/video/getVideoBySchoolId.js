const express=require('express');
const router=express.Router();

const{getVideoBySchoolId}=require('../../Controller/video');

router.get('/getVideoBySchoolId',getVideoBySchoolId);

module.exports=router;


