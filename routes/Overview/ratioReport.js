const express=require('express');
const router=express.Router();
const{countRatio}=require('../../Controller/dashboard');
router.get('/ratioData',countRatio);
module.exports=router;