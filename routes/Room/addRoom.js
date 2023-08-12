const express=require('express');
const router=express.Router();
const{addRoom}=require('../../Controller/room');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/addRoom',upload.none(),addRoom);

module.exports=router;