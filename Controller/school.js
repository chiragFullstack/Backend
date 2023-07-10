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

const getSchool=(req,res)=>{
    pool.query('select * from tblschool',(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        });
    });
}

const getSchoolById=(req,res)=>{
    const id = parseInt(req.params.id);
    pool.query('select * from tblschool where id=$1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        });
    });
}

const deleteSchool=(req,res)=>{
    const id = parseInt(req.params.id);
    pool.query('delete  from tblschool where id = $1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        }); 
    });
}

module.exports={
     getSchool,deleteSchool,getSchoolById
}
