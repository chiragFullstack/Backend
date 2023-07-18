const Pool=require("pg").Pool
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const pool=new Pool({
    user:'developer',
    host:'54.172.2.94',
    database:'daycare',
    password:'wP322$pSIdsc',
    port:5432
});


const getSubadmin=(req,res)=>{
    pool.query('select * from subadmin',(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        });
    });
}
const deleteSubadmin=(req,res)=>{
    const id = parseInt(req.params.id);
    pool.query('delete  from subadmin where id = $1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        }); 
    });
}

const getSubadminById=(req,res)=>{
    const id = parseInt(req.params.id);
    pool.query('select * from subadmin where id=$1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        });
    });
}


module.exports={
    getSubadmin,deleteSubadmin,getSubadminById
}