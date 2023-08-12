const express=require('express');
const router=express.Router();
const{addSubadmin}=require('../../Controller/subAdmin');


const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/addSubadmin',upload.single('picurl'),addSubadmin);
module.exports=router;