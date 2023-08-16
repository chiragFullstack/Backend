const express=require('express');
const router=express.Router();


const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const{saveReport}=require('../../Controller/studentReport');
router.post('/addReport',upload.none(),saveReport);

module.exports=router;