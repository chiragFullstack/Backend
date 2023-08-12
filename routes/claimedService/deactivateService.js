const express=require('express');
const router=express.Router();
const{deactivateService}=require('../../Controller/serviceClaim');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put('/deactivateService',upload.none(),deactivateService);

module.exports=router;