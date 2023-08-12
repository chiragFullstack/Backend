const express=require('express');
const router=express.Router();
const{getServiceById}=require('../../Controller/schoolservice');
router.get('/ServiceById',getServiceById);
module.exports=router;