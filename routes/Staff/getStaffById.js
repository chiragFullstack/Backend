const express=require('express');
const router=express.Router();
const{getStaffById}=require('../../Controller/Staff');
router.get('/staffById',getStaffById);
module.exports=router;