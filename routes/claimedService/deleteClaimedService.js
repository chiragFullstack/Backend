const express=require('express');
const router=express.Router();
const{deleteClaimedService}=require('../../Controller/serviceClaim');
router.delete('/deleteClaimedService',deleteClaimedService);
module.exports=router;