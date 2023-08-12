const express=require('express');
const router=express.Router();
const{getSubadmin}=require('../../Controller/subAdmin');
router.get('/subadminlist',getSubadmin);
module.exports=router;