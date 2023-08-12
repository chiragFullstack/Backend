const express=require('express');
const router=express.Router();
const{editParent}=require('../../Controller/parent');


const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.put('/editParent',upload.none(),editParent);
module.exports=router;