const Pool=require("pg").Pool;
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ dest: 'uploads/' });

const pool=new Pool({
    user:'developer',
    host:'54.172.2.94',
    database:'daycare',
    password:'wP322$pSIdsc',
    port:5432
});
const getStaffStatus=async(req,res)=>{
    const staffid = parseInt(req.query.id);
    console.log(staffid);
    const currentDate=new Date();
    await pool.query('select *  from tblstaffcheckin where staffid=$1 and attendenceDate=$2', [staffid,currentDate], (err, result) => {
        if (err) { console.log(err);
            res.status(err.code).json({
                status:true,
                statusCode:err.code,
                message:err.message
            });
        }
        else {
            res.status(200).json({
                status:true,
                statusCode:200,
                message:'Staff Attendence Status',
                data:result.rows
            });
        }
    });
}


const staffCheckIn=(req, res)=>{
    const{staffid,schoolid}=req.body;
    staffid=parseInt(staffid);
    schoolid=parseInt(schoolid);
    console.log(req.body);
    pool.connect();
    const checkInStatus=true; 
    const checkIndate=new Date();
        pool.query('insert into tblstaffcheckin(staffid,schoolid,attendencedate,attendence)values($1,$2,$3,$4) RETURNING *',[staffid,schoolid,checkIndate,checkInStatus],(err,result)=>{
        if(err){console.log(err);
            res.status(err.code).json({
                status:true,
                statusCode:err.code,
                message:err.message
            });
        }else{
            res.status(200).json({
                status:true,
                statusCode:200,
                message:'attendence Recorded',
                data:result.rows
            });
        }
    });    
}



const staffCheckOut=(req, res)=>{
    const{staffid,schoolid}=req.body;
    staffid=parseInt(staffid);
    schoolid=parseInt(schoolid);
    console.log(req.body);
    pool.connect();
    const checkInStatus=false; 
    const checkIndate=new Date();
        pool.query('update tblstaffcheckin set attendence=$1 where staffid=$2 and attendencedate=$3 RETURNING *',[checkInStatus,staffid,checkIndate],(err,result)=>{
        if(err){console.log(err);
            res.status(err.code).json({
                status:true,
                statusCode:err.code,
                message:err.message
            });
        }else{
            res.status(200).json({
                status:true,
                statusCode:200,
                message:'attendence Recorded',
                data:result.rows 
            });
        }
    });    
}


module.exports={
    staffCheckIn,staffCheckOut,getStaffStatus
}
