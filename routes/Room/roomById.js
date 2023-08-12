const express=require('express');
const router=express.Router();
const{getRoomById}=require('../../Controller/room');
router.get('/roomById',getRoomById);
module.exports=router;