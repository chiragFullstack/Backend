const express=require('express');
const router=express.Router();
const{getParentById}=require('../../Controller/parent');
router.get('/ParentById',getParentById);
module.exports=router;