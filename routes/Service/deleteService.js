const express=require('express');
const router=express.Router();
const{deleteService}=require('../../Controller/schoolservice');
router.delete('/deleteService',deleteService);
module.exports=router;