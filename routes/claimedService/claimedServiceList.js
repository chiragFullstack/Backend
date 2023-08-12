const express=require('express');
const router=express.Router();
const{getClaimServiceBySchoolId}=require('../../Controller/serviceClaim');
router.get('/getClaimServiceBySchoolId',getClaimServiceBySchoolId);
module.exports=router;