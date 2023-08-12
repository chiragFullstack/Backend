const express=require('express');
const router=express.Router();
const{getSubadminById}=require('../../Controller/subAdmin');
router.get('/getSubadminById',getSubadminById);
module.exports=router;