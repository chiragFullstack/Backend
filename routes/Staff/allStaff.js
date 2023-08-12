const express=require('express');
const router=express.Router();
const{getStaff}=require('../../Controller/Staff');
router.get('/allStaff',getStaff);
module.exports=router;