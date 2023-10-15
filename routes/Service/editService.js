const express=require('express');
const router=express.Router();
const{editService}=require('../../Controller/schoolservice');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put('/editService',upload.none(),editService);
module.exports=router;