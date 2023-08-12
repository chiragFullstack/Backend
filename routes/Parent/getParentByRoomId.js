const express=require('express');
const router=express.Router();
const{getParentByRoomId}=require('../../Controller/parent');
router.get('/getParentByRoomId',getParentByRoomId);
module.exports=router;