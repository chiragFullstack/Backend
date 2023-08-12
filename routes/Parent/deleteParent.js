const express=require('express');
const router=express.Router();
const{deleteParent}=require('../../Controller/parent');
router.delete('/deleteParent',deleteParent);
module.exports=router;