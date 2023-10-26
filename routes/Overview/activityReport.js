const express=require('express');
const router=express.Router();
const{activityCount}=require('../../Controller/dashboard');
router.get('/activityData',activityCount);
module.exports=router;