const express=require('express');
const router=express.Router();
const{addClaimedService}=require('../../Controller/serviceClaim');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/addNewService',upload.none(),addClaimedService);
module.exports=router;