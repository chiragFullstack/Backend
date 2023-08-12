const express=require('express');
const router=express.Router();
const{getStudentByRoomId}=require('../../Controller/student');
router.get('/getStudentByRoomId',getStudentByRoomId);
module.exports=router;