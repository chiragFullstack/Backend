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
        res.json({
            data:result.rows
        });
    });
}
const deleteStudent=(req,res)=>{
    const id = parseInt(req.params.id);
    pool.query('delete  from tnlstudent where id = $1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        }); 
    });
}

const getStudentById=(req,res)=>{
    const id = parseInt(req.params.id);
    pool.query('select * from tblstudent where id=$1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        });
    });
}


module.exports={
    getStudent,deleteStudent,getStudentById
}