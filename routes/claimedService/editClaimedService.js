const express=require('express');
const router=express.Router();
const{editClaimedService}=require('../../Controller/serviceClaim');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put('/addNewService',upload.none(),editClaimedService);
module.exports=router;