const express=require('express');
const router=express.Router();
const{getSchoolById}=require('../../Controller/school');
router.get('/schoolById',getSchoolById);
module.exports=router;