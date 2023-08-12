const express=require('express');
const router=express.Router();
const{getSchool}=require('../../Controller/school');
router.get('/allSchool',getSchool);
module.exports=router;