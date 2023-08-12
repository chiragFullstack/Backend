const express=require('express');
const router=express.Router();
const{getClaimedServiceById}=require('../../Controller/serviceClaim');
router.get('/getClaimedServiceById',getClaimedServiceById);
module.exports=router;