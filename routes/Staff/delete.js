const express=require('express');
const router=express.Router();
const{deleteStaff}=require('../../Controller/Staff');
router.delete('/deleteStaff',deleteStaff);
module.exports=router;