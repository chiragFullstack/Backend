

const express=require('express');
const router=express.Router();
const{insertParent}=require('../../Controller/parent');


const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/addParent',upload.none(),insertParent);

module.exports=router;