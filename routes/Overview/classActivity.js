const express=require('express');
const router=express.Router();
const{classCount}=require('../../Controller/dashboard');
router.get('/classData',classCount);
module.exports=router;