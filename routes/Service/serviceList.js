const express=require('express');
const router=express.Router();
const{getService}=require('../../Controller/schoolservice');
router.get('/allService',getService);
module.exports=router;