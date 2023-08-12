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

const getService=(req,res)=>{
    pool.query('select * from tblservice',(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        });
    });
}

const deleteService=(req,res)=>{
    let id=0;
    if(req.query.id){
        id= parseInt(req.query.id);
    }else{
        id= parseInt(req.body.id);
    }
    pool.query('delete  from tblservice where id = $1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        }); 
    });
}


const getServiceById=(req,res)=>{
    const id = parseInt(req.query.id);
    pool.query('select * from tblservice where id=$1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        });
    });
}

const insertService=(req, res) =>{
    const{servicename,description}=req.body;
    console.log(req.body);
    pool.connect();
    pool.query('insert into tblservice(servicename,description)values($1,$2) RETURNING *',[servicename, description],(err,result)=>{
        if(err){console.log(err); throw err}else{
            res.status(200).json({
                msg:'record Inserted',
                data:result.rows[0],
            });
        }
    });    
}

const editService=(req, res) =>{
    let id=0;
    if(req.query.id){
        id= parseInt(req.query.id);
    }else{
        id= parseInt(req.body.id);
    }
    const{servicename,description}=req.body;
    console.log(req.body);
    pool.connect();
    pool.query('update tblservice set servicename=$1,description=$2 where id='+id+' RETURNING *',[servicename, description],(err,result)=>{
        if(err){console.log(err); throw err}else{
            res.status(200).json({
                msg:'record Updated',
                data:result.rows[0],
            });
        }
    });
}

module.exports={
    getService,deleteService,getServiceById,insertService,editService
}
