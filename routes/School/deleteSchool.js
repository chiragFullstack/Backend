const express=require('express');
const router=express.Router();
const{deleteSchool}=require('../../Controller/school');
router.delete('/deleteSchool',deleteSchool);
module.exports=router;