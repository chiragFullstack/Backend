const express=require('express');
const router=express.Router();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const{editVideo}=require('../../Controller/video');

router.put('/editVideo',upload.single('videourl'),editVideo);

module.exports=router;