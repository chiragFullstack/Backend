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
const getParent=(req,res)=>{
    pool.query('select * from parent',(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        });
    });
}

const getParentById=(req,res)=>{
    const id = parseInt(req.params.id);
    pool.query('select * from parent where id=$1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        });
    });
}

const deleteParent=(req,res)=>{
    const id = parseInt(req.params.id);
    pool.query('delete  from parent where id = $1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        }); 
    });
}

module.exports={
    getParent,deleteParent,getParentById
}
