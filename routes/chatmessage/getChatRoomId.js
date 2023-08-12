const express=require('express');
const router=express.Router();
const{getChatRoomId}=require('../../Controller/message');
router.get('/getChatRoomId',getChatRoomId);
module.exports=router;