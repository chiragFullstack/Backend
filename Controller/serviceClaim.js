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

const getClaimService=(req,res)=>{
    pool.query('select obtainedservice.id, tblschool.name, tblservice.servicename, obtainedservice.obtainingdate,obtainedservice.status from obtainedservice inner join tblschool on tblschool.id=obtainedservice.schoolid inner join tblservice on tblservice.id=obtainedservice.serviceid',(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        });
    });
}

const getClaimServiceBySchoolId=(req,res)=>{
    const id=parseInt(req.query.id);
    pool.query('select obtainedservice.id, tblschool.name, tblservice.servicename, obtainedservice.obtainingdate,obtainedservice.status from obtainedservice inner join tblschool on tblschool.id=obtainedservice.schoolid inner join tblservice on tblservice.id=obtainedservice.serviceid where obtainedservice.schoolid=$1',[id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        });
    });
}

const getClaimedServiceById=(req,res)=>{
    const id = parseInt(req.query.id);
    pool.query('select * from obtainedservice where id=$1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        });
    });
}


const deleteClaimedService=(req,res)=>{
    let id=0;
    if(req.query.id){
        id= parseInt(req.query.id);
    }else{
        id= parseInt(req.body.id);
    }
    pool.query('delete  from obtainedservice where id = $1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        }); 
    });
}

const deactivateService=(req, res) =>{
    let id=0;
    if(req.query.id){
        id= parseInt(req.query.id);
    }else{
        id= parseInt(req.body.id);
    }
    const status=req.body.status;
    console.log(status);
    pool.connect();
    pool.query('update obtainedservice set status=$1 where id='+id+' RETURNING *',[status],(err,result)=>{
        if(err){console.log(err); throw err}else{
            res.status(200).json({
                msg:'record Updated',
                data:result.rows[0],
            });
        }
    });    
}

const addClaimedService=(req, res)=>{
    const{serviceid,status,schoolid,obtainingdate}=req.body;
    console.log(req.body);
    pool.connect();
    pool.query('insert into obtainedservice(serviceid,status,schoolid,obtainingdate)values($1,$2,$3,$4) RETURNING *',[serviceid,status,schoolid,obtainingdate],(err,result)=>{
        if(err){console.log(err); throw err}else{
            res.status(200).json({
                msg:'Servcie Obtained',
                data:result.rows[0],
            });
        }
    });  
}
const editClaimedService=(req,res)=>{
    const{serviceid,status,schoolid,obtainingdate}=req.body;
    let id=0;
    if(req.query.id){
        id= parseInt(req.query.id);
    }else{
        id= parseInt(req.body.id);
    }
    
    pool.connect();
    pool.query('update obtainedservice set serviceid=$1,status=$2,schoolid=$3,obtainingdate=$4 where id='+id+' RETURNING *',[serviceid,status,schoolid,obtainingdate],(err,result)=>{
        if(err){console.log(err); throw err}else{
            res.status(200).json({
                msg:'record Updated',
                data:result.rows[0],
            });
        }
    }); 
}
module.exports={
    getClaimService,deleteClaimedService,getClaimedServiceById,getClaimServiceBySchoolId,deactivateService,addClaimedService,editClaimedService
}


