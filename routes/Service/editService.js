const express=require('express');
const router=express.Router();
const{editService}=require('../../Controller/schoolservice');
router.put('/editService',editService);
module.exports=router;