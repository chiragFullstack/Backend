const express=require('express');
const router=express.Router();
const{getRoomBySchoolId}=require('../../Controller/room');
router.get('/roomBySchoolId',getRoomBySchoolId);
module.exports=router;