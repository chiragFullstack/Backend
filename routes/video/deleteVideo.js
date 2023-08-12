const express=require('express');
const router=express.Router();
const{deleteVideo}=require('../../Controller/video');
router.delete('/deleteVideo',deleteVideo);
module.exports=router;