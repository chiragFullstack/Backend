const express=require('express');
const router=express.Router();
const{getParentListBySchool}=require('../../Controller/parent');
router.get('/allParent',getParentListBySchool);
module.exports=router;
