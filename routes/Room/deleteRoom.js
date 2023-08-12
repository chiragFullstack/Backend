const express=require('express');
const router=express.Router();
const{deleteRoom}=require('../../Controller/room');
router.delete('/deleteRoom',deleteRoom);
module.exports=router;