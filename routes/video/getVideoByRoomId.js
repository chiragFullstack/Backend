const express=require('express');
const router=express.Router();

const{getVideoByRoomId}=require('../../Controller/video');

router.get('/getVideoByRoomId',getVideoByRoomId);
module.exports=router;