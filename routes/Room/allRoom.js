const express=require('express');
const router=express.Router();
const{getRoom}=require('../../Controller/room');
router.get('/allRoom',getRoom);
module.exports=router;