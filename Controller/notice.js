const Pool=require("pg").Pool

const pool=new Pool({
    user:'developer',
    host:'54.172.2.94',
    database:'daycare',
    password:'wP322$pSIdsc',
    port:5432
});


const getNotice=(req,res)=>{
    pool.query('select * from tblnotice',(err,result)=>{
        if(err){console.log(err);
            res.status(400).json({
                message:err,
                statusCode:400,
                status:false
            });
        }
        else{
            res.status(200).json({
                message:'All Record',
                statusCode:200,
                status:true,
                data:result.rows
            });
        }
    });
}

const getNoticeListBySchool=(req,res)=>{
    const id=parseInt(req.query.id);
    pool.query('select * from tblnotice where schoolid=$1',[id],(err,result)=>{
        if(err){console.log(err);
            res.status(400).json({
                message:err,
                statusCode:400,
                status:false
            });
        }
        else{
            res.status(200).json({
                message:'All Notice',
                statusCode:200,
                status:true,
                data:result.rows
            });
        }
    });
}

const deleteNoticeBySchool=(req,res)=>{
    let id=0;
    if(req.query.id){
        id= parseInt(req.query.id);
    }else{
        id= parseInt(req.body.id);
    }
    pool.query('delete from tblnotice where id=$1',[id],(err,result)=>{
        if(err){console.log(err);
            res.status(400).json({
                message:err,
                statusCode:400,
                status:false,  
            });
        }
        else{
            res.status(200).json({
                message:'All Notice',
                statusCode:200,
                status:true,
                data:result.rows
            });
        }
    });
}



const addNotice=async(req, res) =>{
    const{schoolId,message,noticedate}=req.body;
    console.log(schoolId,'---',req.body);
    pool.connect();
    pool.query('insert into tblnotice(schoolid,message,noticedate)values($1,$2,$3) RETURNING *',[schoolId,message,noticedate],(err,result)=>{
        if(err){console.log(err); 
            res.status(400).json({
                statusCode:400,
                message:err,
                status:false
            });
        }
        else{
            res.status(200).json({
                statusCode:200,
                message:'Room Record Inserted',
                data:result.rows[0],
                status:true
            });
        }
    });    
}


const editNotice=async(req, res) =>{
    let id=0;
    if(req.query.id){
        id= parseInt(req.query.id);
    }else{
        id= parseInt(req.body.id);
    }
    const{schoolId,message,noticedate}=req.body;
    let school_id = parseInt(schoolId)
    console.log(school_id,'---',req.body);
    pool.connect();
    pool.query('update tblnotice set schoolid=$1,message=$2,noticedate=$3 where id='+id+' RETURNING *',[school_id,message,noticedate],(err,result)=>{
        if(err){console.log(err); 
            res.status(err.code).json({
                statusCode:err.code,
                message:err.message,
                status:false
            });
        }
        else{
            res.status(200).json({
                statusCode:200,
                message:'Room Record Inserted',
                data:result.rows,
                status:true
            });
        }
    });    
}

module.exports={
    getNotice,getNoticeListBySchool, deleteNoticeBySchool,addNotice,editNotice
}