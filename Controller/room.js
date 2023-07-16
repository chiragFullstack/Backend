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

const getRoom=(req,res)=>{
    pool.query('select * from tblclass',(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        });
    });
}

const deleteRoom=(req,res)=>{
    const id = parseInt(req.params.id);
    pool.query('delete  from tblclass where id = $1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        }); 
    });
}


const getRoomById=(req,res)=>{
    const id = parseInt(req.params.id);
    pool.query('select * from tblclass where id=$1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        });
    });
}


const getRoomBySchoolId=(req,res)=>{
    const id = parseInt(req.params.id);
    pool.query('select * from tblclass where schoolid=$1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        });
    });
}
module.exports={
    getRoom,deleteRoom,getRoomById,getRoomBySchoolId
}
