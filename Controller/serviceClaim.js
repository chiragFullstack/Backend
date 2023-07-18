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


const getClaimedServiceById=(req,res)=>{
    const id = parseInt(req.params.id);
    pool.query('select * from obtainedservice where id=$1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        });
    });
}


const deleteClaimedService=(req,res)=>{
    const id = parseInt(req.params.id);
    pool.query('delete  from obtainedservice where id = $1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        }); 
    });
}

module.exports={
    getClaimService,deleteClaimedService,getClaimedServiceById
}


