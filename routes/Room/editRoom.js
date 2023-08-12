const express=require('express');
const router=express.Router();
const{editRoom}=require('../../Controller/room');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put('/editRoom',upload.none(),editRoom);
module.exports=router;