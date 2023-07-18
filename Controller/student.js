const Pool=require("pg").Pool
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const pool=new Pool({
    user:'postgres',
    host:'localhost',
    database:'dayCareDB',
    password:'123456',
    port:5432
});


const getStudent=(req,res)=>{
    pool.query('select * from tblstudent',(err,result)=>{
        if(err){console.log(err); throw err}
        res.status(200).json({
            message:'true',
            statusCode:200,
            data:result.rows
        });
    });
}
const deleteStudent=(req,res)=>{
    const id = parseInt(req.params.id);
    pool.query('delete  from tnlstudent where id = $1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.status(200).json({
            message:'true',
            statusCode:200,
            data:result.rows
        }); 
    });
}

const getStudentById=(req,res)=>{
    const id = parseInt(req.params.id);
    pool.query('select * from tblstudent where id=$1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.status(200).json({
            message:'true',
            statusCode:200,
            data:result.rows
        });
    });
}

const getStudentByparentId=(req,res)=>{
    const parentid = parseInt(req.params.id);
    pool.query('select * from tblstudent where parentid=$1',[parentid],(err,result)=>{
        if(err){console.log(err); throw err}
        res.status(200).json({
            message:'true',
            statusCode:200,
            data:result.rows
        });
    });
}


const getStudentByRoomId=(req,res)=>{
    const id = parseInt(req.params.id);
    pool.query('select * from tblstudent where roomid=$1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.status(200).json({
            message:'true',
            statusCode:200,
            data:result.rows
        });
    });
}


const getStudentBySchoolId=(req,res)=>{
    const id = parseInt(req.params.id);
    pool.query('select * from tblstudent where schoolid=$1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.status(200).json({
            message:'true',
            statusCode:200,
            data:result.rows
        });
    });
}



module.exports={
    getStudent,deleteStudent,getStudentById,getStudentBySchoolId,getStudentByRoomId,getStudentByparentId
}