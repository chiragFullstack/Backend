const Pool=require("pg").Pool
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// const pool=new Pool({
//     user:'postgres',
//     host:'localhost',
//     database:'dayCareDB',
//     password:'123456',
//     port:5432
// });

const pool=new Pool({
    user:'developer',
    host:'54.172.2.94',
    database:'daycare',
    password:'wP322$pSIdsc',
    port:5432
});
const getRoom=(req,res)=>{
    pool.query('select * from tblclass',(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            message:'All Record',
            statusCode:200,
            status:true,
            data:result.rows
        });
    });
}

const deleteRoom=(req,res)=>{
    const id = parseInt(req.body.id);
    console.log('ID ====',req.body.id)
    pool.query('delete  from tblclass where id = $1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            message:'Record Deleted',
            statusCode:200,
            status:true,
            data:result.rows
        }); 
    });
}

const deleteRoomweb=(req,res)=>{
    const id = parseInt(req.params.id);
    console.log('ID ====',req.params.id)
    pool.query('delete  from tblclass where id = $1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            message:'Record Deleted',
            statusCode:200,
            status:true,
            data:result.rows
        }); 
    });
}

const getRoomById=(req,res)=>{
    const id = parseInt(req.query.id);
    pool.query('select * from tblclass where id=$1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            message:'Record of Single Room',
            statusCode:200,
            status:true,
            data:result.rows
        });
    });
}

const getRoomByIdWeb=(req,res)=>{
    const id = parseInt(req.params.id);
    pool.query('select * from tblclass where id=$1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            message:'Record of Single Room',
            statusCode:200,
            status:true,
            data:result.rows
        });
    });
}

const getRoomBySchoolId=(req,res)=>{
    const id = parseInt(req.query.id);
    console.log('ID=====',req.query.id);
    pool.query('select * from tblclass where schoolid=$1',[id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            message:'Record by Passing School Id',
            statusCode:200,
            status:true,
            data:result.rows
        });
    });
}

const getRoomBySchoolWebId=(req,res)=>{
    const id = parseInt(req.params.id);
    console.log('ID=====',req.params.id);
    pool.query('select * from tblclass where schoolid=$1',[id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            message:'Record by Passing School Id',
            statusCode:200,
            status:true,
            data:result.rows
        });
    });
}
module.exports={
    getRoom,deleteRoom,getRoomById,getRoomBySchoolId,getRoomBySchoolWebId,deleteRoomweb,getRoomByIdWeb
}
