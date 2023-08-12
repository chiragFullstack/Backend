const express=require('express');
const router=express.Router();
const{deleteSubadmin}=require('../../Controller/subAdmin');
router.delete('/deleteSubadmin',deleteSubadmin);
module.exports=router;