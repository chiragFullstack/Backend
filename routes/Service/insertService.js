const express=require('express');
const router=express.Router();
const{insertService}=require('../../Controller/schoolservice');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/addService',upload.none(),insertService);
module.exports=router;