const express=require('express');
const router=express.Router();


const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const{recordVideo}=require('../../Controller/video');
router.post('/addVideo',upload.single('videourl'),recordVideo);

module.exports=router;

