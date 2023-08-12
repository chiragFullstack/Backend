const express=require('express');
const router=express.Router();
const{insertService}=require('../../Controller/schoolservice');
router.post('/addService',insertService);
module.exports=router;