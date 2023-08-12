const express=require('express');
const router=express.Router();
const{chkLogin}=require('../../Controller/login');

router.post('/checkLogin',chkLogin);

module.exports=router;