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
    const currentDate=req.query.fromdate;
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
    let {staffid,schoolid}=req.body;
    staffid=parseInt(staffid);
    schoolid=parseInt(schoolid);
    console.log(req.body);
    pool.connect();
    let checkInStatus=true; 
    let checkIndate=new Date();
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

const getStaffAttendenceReport = async (req, res) => {
    const staffid =parseInt(req.query.id);
    const fromDate=req.query.fromdate;
    const toDate=req.query.todate;
    if(req.query.hasOwnProperty('id') && req.query.hasOwnProperty('fromdate') && req.query.hasOwnProperty('todate')){
        await pool.query('select *  from tblstaffcheckin where staffid=$1 and attendenceDate>=$2 and attendenceDate<$3', [staffid,fromDate,toDate],(err, result) => {
            if (err) {
                console.log(err);
                res.status(err.code).json({
                    status: true,
                    statusCode: err.code,
                    message: err.message,
                    data:[]
                });
            }
            else {
                res.status(200).json({
                    status: true,
                    statusCode: 200,
                    message: 'Staff Attendence Status with 2 Dates',
                    data: result.rows 
                });
            }
        });
    }
}

const getStaffReportBySchoolId = async (req, res) => {
    const schoolid =parseInt(req.query.id);
    const fromDate=req.query.fromdate;
    const toDate=req.query.todate;
    
    if(schoolid!='' && fromDate!='' && toDate!=''){
        await pool.query('select tblstaffcheckin.staffid,tblstaff.name, count(tblstaffcheckin.attendence) as totalAttendence from tblstaffcheckin inner join tblstaff  on tblstaff.id=tblstaffcheckin.staffid where tblstaffcheckin.schoolid=$1 and attendencedate>=$2 and attendencedate<=$3 and tblstaffcheckin.attendence=true group by  tblstaffcheckin.staffid,tblstaff.name', [schoolid,fromDate,toDate],(err, result) => {
            if (err) {
                console.log(err);
                res.status(err.code).json({
                    status: true,
                    statusCode: err.code,
                    message: err.message,
                    data:[]
                });
            }
            else {
                res.status(200).json({
                    status: true,
                    statusCode: 200,
                    message: 'Student Attendence Status with single ',
                    data: result.rows 
                });
            }
        });
    }
}


module.exports={
    staffCheckIn,staffCheckOut,getStaffStatus,getStaffAttendenceReport,getStaffReportBySchoolId
}
