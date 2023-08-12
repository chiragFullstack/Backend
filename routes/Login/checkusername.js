const express=require('express');
const router=express.Router();
const{chkUsername}=require('../../Controller/login');

router.post('/checkusername',chkUsername);

module.exports=router;