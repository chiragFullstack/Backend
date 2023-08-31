const Pool=require("pg").Pool
const moment = require('moment');

const pool=new Pool({
    user:'developer',
    host:'54.172.2.94',
    database:'daycare',
    password:'wP322$pSIdsc',
    port:5432
});

const saveReport=async(req, res) =>{
    const{schoolId,studentId,roomId,naptime, napduration, mealtime,mealstype, notes, activity,checkuptime, checkupstatus,allergystatus,allergydescription }=req.body;
    pool.connect();
    let schoolName='';
    let studentName='';
    let roomName='';
    let parentName='';
    const currentDateTime = moment();
    // Format the date and time
    var utcMoment = moment.utc();
    const formattedDateTime = new Date( utcMoment.format() );
    let student_Id=parseInt(studentId);
    const resultsub = await pool.query('select tblschool.name as schoolname,tblstudent.studentname, parent.name as parentname,tblclass.name as roomname from tblstudent inner join tblschool on tblschool.id=tblstudent.schoolid inner join parent on parent.schoolid=tblschool.id inner join tblclass  on tblclass.id=tblstudent.roomid where tblstudent.id=$1',[student_Id],(err,result)=>{
        if(err){
            res.status(200).json({
                statusCode:200,
                message:'Record not found ',
                data:[],
                status:false
            });
        }
        else{
            console.log(result.rowCount)
            if (result.rowCount> 0) {
                for (const row of result.rows) {
                    studentName = row.studentname;
                    schoolName = row.schoolname;
                    parentName=row.parentname;
                    roomName=row.roomname;
                    console.log(row);
                }
                pool.query('insert into studentactivityreport(studentname,schoolname,roomname,parentname,reportdate, naptime,napduration,mealtime,mealtype,notes,activity,checkuptime,checkupstatus,studentid,allergystatus,allergydescription)values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *',[studentName,schoolName,roomName,parentName,formattedDateTime,naptime,napduration, mealtime, mealstype, notes, activity, checkuptime, checkupstatus,studentId,allergystatus,allergydescription],(err,result)=>{
                    if(err){console.log(err); 
                        res.status(400).json({
                            statusCode:400,
                            message:err,
                            status:false,
                            data:[]
                        });
                    }
                    else{
                        res.status(200).json({
                            statusCode:200,
                            message:'Reports Saved',
                            data:result.rows[0],
                            status:true
                        });
                    }
                });
            } else {
                res.status(400).json({
                    statusCode:400,
                    message:'student id not found ',
                    data:[],
                    status:false
                });
            }  
        }
    });        
}


const getReport=async(req,res)=>{
    const studentId=parseInt(req.query.id);
    const reportDate=new Date(req.query.date);
    await pool.query('select * from studentactivityreport where studentid=$1 and reportdate>$2',[studentId,reportDate],(err,result)=>{
        if(err){
            console.log(err);
            res.status(400).json({
                statusCode:400,
                message:err,
                status:false,
                data:[]
            });
        }
        else{
            res.status(200).json({
                statusCode:200,
                message:'get full report',
                data:result.rows,
                status:true
            });
        }
     });
}

const getReportByDate=async(req,res)=>{
    console.log(req.query.id,'---',typeof(req.query.fromdate));
    const studentId=parseInt(req.query.id);
    const fromDate=new Date(req.query.fromdate);
    const toDate=new Date(req.query.todate);
    await pool.query('select * from studentactivityreport where studentid=$1 and reportdate>$2 and reportdate<$3',[studentId,fromDate,toDate],(err,result)=>{
        if(err){
            console.log(err);
            res.status(400).json({
                statusCode:400,
                message:err,
                status:false,
                data:[]
            });
        }
        else{
            console.log('match ed ',result.rowCount);
            res.status(200).json({
                statusCode:200,
                message:'Full Report',
                data:result.rows,
                status:true
            });
        }
     });
}

const getReportByParentId=async(req,res)=>{
    console.log(req.query.id,'---',typeof(req.query.fromdate));
    const parentId=parseInt(req.query.id);
    const fromDate=new Date(req.query.fromdate);
    const toDate=new Date(req.query.todate);
    await pool.query('select studentactivityreport.studentname,studentactivityreport.schoolname, studentactivityreport.roomname,studentactivityreport.parentname, studentactivityreport.reportdate,studentactivityreport.naptime, studentactivityreport.napduration,studentactivityreport.mealtime,studentactivityreport.mealtype, studentactivityreport.notes,studentactivityreport.activity,studentactivityreport.checkuptime, studentactivityreport.checkupstatus,studentactivityreport.allergystatus,studentactivityreport.allergydescription from studentactivityreport inner join parent on parent.name=studentactivityreport.parentname where parent.id=$1 AND studentactivityreport.reportdate>$2 AND studentactivityreport.reportdate<$3',[parentId,fromDate,toDate],(err,result)=>{
        if(err){
            console.log(err);
            res.status(400).json({
                statusCode:400,
                message:err,
                status:false,
                data:[]
            });
        }
        else{
            console.log('match ed ',result.rowCount);
            res.status(200).json({
                statusCode:200,
                message:'Full Report',
                data:result.rows,
                status:true
            });
        }
     });    
}

const getTodayReportByParentId=async(req,res)=>{
    console.log(req.query.id,'---',typeof(req.query.fromdate));
    const parentId=parseInt(req.query.id);
    await pool.query('select studentactivityreport.studentname,studentactivityreport.schoolname, studentactivityreport.roomname,studentactivityreport.parentname, studentactivityreport.reportdate,studentactivityreport.naptime, studentactivityreport.napduration,studentactivityreport.mealtime,studentactivityreport.mealtype, studentactivityreport.notes,studentactivityreport.activity,studentactivityreport.checkuptime, studentactivityreport.checkupstatus,studentactivityreport.allergystatus,studentactivityreport.allergydescription from studentactivityreport inner join parent on parent.name=studentactivityreport.parentname where parent.id=$1 AND studentactivityreport.reportdate=$2 ',[parentId,req.query.fromdate],(err,result)=>{
        if(err){
            console.log(err);
            res.status(400).json({
                statusCode:400,
                message:err,
                status:false,
                data:[]
            });
        }
        else{
            console.log('match ed ',result.rowCount);
            res.status(200).json({
                statusCode:200,
                message:'Full Report',
                data:result.rows,
                status:true
            });
        }
     });    
}


const getReportByRoomId=async(req,res)=>{
    console.log(req.query.id,'---',typeof(req.query.fromdate));
    const roomId=parseInt(req.query.id);
    const fromDate=new Date(req.query.fromdate);
    await pool.query('select studentactivityreport.studentname,studentactivityreport.schoolname, studentactivityreport.roomname,studentactivityreport.parentname, studentactivityreport.reportdate,studentactivityreport.naptime, studentactivityreport.napduration,studentactivityreport.mealtime,studentactivityreport.mealtype, studentactivityreport.notes,studentactivityreport.activity,studentactivityreport.checkuptime, studentactivityreport.checkupstatus,studentactivityreport.allergystatus,studentactivityreport.allergydescription from studentactivityreport inner join tblclass on tblclass.name=studentactivityreport.roomname where tblclass.id=$1 AND studentactivityreport.reportdate=$2',[roomId,req.query.fromdate],(err,result)=>{
        if(err){
            console.log(err);
            res.status(400).json({
                statusCode:400,
                message:err,
                status:false,
                data:[]
            });
        }
        else{
            console.log('match ed ',result.rowCount);
            res.status(200).json({
                statusCode:200,
                message:'Full Report',
                data:result.rows,
                status:true
            });
        }
     });    
}

const getFullReportByRoomId=async(req,res)=>{
    console.log(req.query.id,'---',typeof(req.query.fromdate));
    const roomId=parseInt(req.query.id);
    const fromDate=new Date(req.query.fromdate);
    const toDate=new Date(req.query.todate);
    await pool.query('select studentactivityreport.studentname,studentactivityreport.schoolname, studentactivityreport.roomname,studentactivityreport.parentname, studentactivityreport.reportdate,studentactivityreport.naptime, studentactivityreport.napduration,studentactivityreport.mealtime,studentactivityreport.mealtype, studentactivityreport.notes,studentactivityreport.activity,studentactivityreport.checkuptime, studentactivityreport.checkupstatus,,studentactivityreport.allergystatus,studentactivityreport.allergydescription from studentactivityreport inner join tblclass on tblclass.name=studentactivityreport.roomname where tblclass.id=$1 AND studentactivityreport.reportdate>$2 AND studentactivityreport.reportdate<$3',[roomId,fromDate,toDate],(err,result)=>{
        if(err){
            console.log(err);
            res.status(400).json({
                statusCode:400,
                message:err,
                status:false,
                data:[]
            });
        }
        else{
            console.log('match ed ',result.rowCount);
            res.status(200).json({
                statusCode:200,
                message:'Full Report',
                data:result.rows,
                status:true
            });
        }
     });    
}

const getBirthReportBySchoolId=async(req,res)=>{
    console.log(req.query.id,'---');
    const schoolId=parseInt(req.query.id);
    await pool.query('select tblstudent.id,tblstudent.studentname,tblclass.name as roomName,tblstudent.dateofbirth from tblstudent inner join tblclass on tblclass.id=tblstudent.roomid where tblstudent.schoolid=$1',[schoolId],(err,result)=>{
        if(err){
            console.log(err);
            res.status(400).json({
                statusCode:400,
                message:err,
                status:false,
                data:[]
            });
        }
        else{
            console.log('matched ',result.rowCount);
            res.status(200).json({
                statusCode:200,
                message:'Full Report',
                data:result.rows,
                status:true
            });
        }
     });    
}

const getContactReportBySchoolId=async(req,res)=>{
    console.log(req.query.id,'---');
    const schoolId=parseInt(req.query.id);
    await pool.query('select tblstudent.id,tblstudent.studentname,parent.name as parentName, parent.contact from tblstudent inner join parent on parent.id=tblstudent.parentid where tblstudent.schoolid=$1',[schoolId],(err,result)=>{
        if(err){
            console.log(err);
            res.status(400).json({
                statusCode:400,
                message:err,
                status:false,
                data:[]
            });
        }
        else{
            console.log('matched ',result.rowCount);
            res.status(200).json({
                statusCode:200,
                message:'Full Report',
                data:result.rows,
                status:true
            });
        }
     });    
}


module.exports={
    saveReport,getReport,getReportByDate,getReportByParentId,getReportByRoomId,
    getFullReportByRoomId,getTodayReportByParentId,getBirthReportBySchoolId,
    getContactReportBySchoolId
};