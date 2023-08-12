const express=require('express');
const router=express.Router();
const{editSubadmin}=require('../../Controller/subAdmin');


const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put('/editSubadmin',upload.single('picurl'),editSubadmin);
module.exports=router;