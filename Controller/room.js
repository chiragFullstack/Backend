const Pool=require("pg").Pool

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
    let id=0;
    if(req.query.id){
        id= parseInt(req.query.id);
    }else{
        id= parseInt(req.body.id);
    }
    pool.query('delete  from tblclass where id = $1', [id],(err,result)=>{
        if(err){console.log(err);
            res.status(err.code).json({
                message:err.message,
                statusCode:err.code,
                status:true
            }); 
        }else{
            res.status(200).json({
                message:'Record Deleted',
                statusCode:200,
                status:true,
                data:result.rows
            }); 
        }
        
    });
}

const getRoomById=(req,res)=>{
    const id = parseInt(req.query.id);
    pool.query('select * from tblclass where id=$1', [id],(err,result)=>{
        if(err){console.log(err);
            res.status(err.code).json({
                message:err.message,
                statusCode:err.code,
                status:true
            }); 
        }else{
            res.status(200).json({
                message:'Record Deleted',
                statusCode:200,
                status:true,
                data:result.rows
            }); 
        }
    });
}

const getRoomByIdWeb=(req,res)=>{
    const id = parseInt(req.params.id);
    pool.query('select * from tblclass where id=$1', [id],(err,result)=>{
        if(err){console.log(err);
            res.status(err.code).json({
                message:err.message,
                statusCode:err.code,
                status:true
            }); 
        }else{
            res.status(200).json({
                message:'Record Deleted',
                statusCode:200,
                status:true,
                data:result.rows
            }); 
        }
    });
}

const getRoomBySchoolId=(req,res)=>{
    const id = parseInt(req.query.id);
    console.log('ID=====',req.query.id);
    pool.query('select * from tblclass where schoolid=$1',[id],(err,result)=>{
        if(err){console.log(err);
            res.status(err.code).json({
                message:err.message,
                statusCode:err.code,
                status:true,
                data:result.rows
            });
        }else{
            res.status(200).json({
                message:'Record by Passing School Id',
                statusCode:200,
                status:true,
                data:result.rows
            });
        }
        
    });
}

const getRoomBySchoolWebId=(req,res)=>{
    const id = parseInt(req.params.id);
    console.log('ID=====',req.params.id);
    pool.query('select * from tblclass where schoolid=$1',[id],(err,result)=>{
        if(err){console.log(err);
            res.status(err.code).json({
                message:err.message,
                statusCode:err.code,
                status:true
            }); 
        }else{
            res.status(200).json({
                message:'Record Deleted',
                statusCode:200,
                status:true,
                data:result.rows
            }); 
        }
    });
}

const addRoom=async(req, res) =>{
    const{name,schoolId,description}=req.body;
    console.log(schoolId,'---',req.body);
    pool.connect();
    pool.query('insert into tblclass(name,schoolid,description)values($1,$2,$3) RETURNING *',[name, schoolId,description],(err,result)=>{
        if(err){console.log(err);
            res.status(err.code).json({
                message:err.message,
                statusCode:err.code,
                status:true
            }); 
        }else{
            res.status(200).json({
                message:'Record Deleted',
                statusCode:200,
                status:true,
                data:result.rows
            }); 
        }
    });    
}

const editRoom=(req, res) =>{
    let id=0;
    if(req.query.id){
        id= parseInt(req.query.id);
    }else{
        id= parseInt(req.body.id);
    }
    const{name,schoolId,description}=req.body;
    console.log(req.body);
    pool.connect();
    pool.query('update tblclass set name=$1,schoolid=$2,description=$3 where id='+id+' RETURNING *',[name,schoolId,description],(err,result)=>{
        if(err){console.log(err);
            res.status(err.code).json({
                message:err.message,
                statusCode:err.code,
                status:true
            }); 
        }else{
            res.status(200).json({
                message:'Record Deleted',
                statusCode:200,
                status:true,
                data:result.rows
            }); 
        }
    });
}

module.exports={
    getRoom,deleteRoom,getRoomById,getRoomBySchoolId,getRoomBySchoolWebId,getRoomByIdWeb,addRoom,editRoom
}
