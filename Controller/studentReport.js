const Pool=require("pg").Pool
const moment = require('moment');

const pool=new Pool({
    user:'developer',
    host:'54.172.2.94',
    database:'daycare',
    password:'wP322$pSIdsc',
    port:5432
});
let idx=0;
let idArray=[];
const manageReport= async(studentId, data)=>{
  //  const{schoolId,roomId,naptime, napduration, mealtime,mealstype, notes, activity,checkuptime, checkupstatus,allergystatus,allergydescription}=req.body;
    let reportType=data.reportType;
    console.log('student Req Body Part',studentId);
    pool.connect();
    let schoolName='';
    let studentName='';
    let roomName='';
    let parentName='';
    const currentDateTime = moment();
    // Format the date and time
    var utcMoment = moment.utc();
    const formattedDateTime = new Date(utcMoment.format('yyyy-MM-DD'));
    const resultsub = await pool.query('select tblschool.name as schoolname,tblstudent.studentname, parent.name as parentname,tblclass.name as roomname from tblstudent inner join tblschool on tblschool.id=tblstudent.schoolid inner join parent on parent.schoolid=tblschool.id inner join tblclass  on tblclass.id=tblstudent.roomid where tblstudent.id=$1',[studentId],(err,result)=>{
        if(err){
            console.log('got the error while fetching data ');
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
                const resultData=pool.query('select * from studentactivityreport where studentid=$1 and DATE(reportdate)=$2',[studentId,formattedDateTime],(errRecord,resultRecord)=>{
                    if(errRecord){
                        console.log(errRecord.message);
                    }else{
                        let activity=data.activity || '';
                        let allergystatus=data.allergystatus || '';
                        let allergydescription=data.allergydescription || '';
                        let naptime=data.naptime || '';
                        let napduration=data.napduration||'';
                        let mealtime=data.mealtime ||'';
                        let mealtype=data.mealtype ||'';
                        let notes=data.notes ||'';
                        let checkuptime=data.checkuptime ||'';
                        let checkupstatus=data.checkupstatus ||'';
                        if(resultRecord.rowCount==undefined || resultRecord.rowCount==0){
                            pool.query('insert into studentactivityreport (studentname, schoolname, roomname, parentname, reportdate,naptime,napduration, mealtime, mealtype, notes, activity, checkuptime, checkupstatus, studentid, allergystatus, allergydescription) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)RETURNING *',[studentName,schoolName, roomName, parentName,formattedDateTime, naptime, napduration, mealtime, mealtype, notes,  activity, checkuptime, checkupstatus,  studentId,allergystatus,allergydescription],(err,result)=>{
                                if(err){   
                                    console.log(err); 
                                }
                                else{
                                    console.log('activity report saved ');
                                }
                            });  
                             
                        }else{
                            if(reportType==0){
                                pool.query('update studentactivityreport set activity=$1 where studentid=$2 and DATE(reportdate)=$3  RETURNING *',[activity, studentId,formattedDateTime],(err,result)=>{
                                    if(err){
                                        console.log(err); 
                                    }
                                    else{
                                        console.log('allergy status updated');
                                    }
                                });  
                            }else if(reportType==1){
                                pool.query('update studentactivityreport set checkuptime=$1,checkupstatus=$2 where studentid=$3 and DATE(reportdate)=$4  RETURNING *',[checkuptime,checkupstatus,studentId,formattedDateTime],(err,result)=>{
                                    if(err){
                                        console.log(err); 
                                    }
                                    else{
                                        console.log('allergy status updated');
                                    }
                                });  
                            }else if(reportType==2){
                                //update meal entry 
                                pool.query('update studentactivityreport set mealtime=$1,mealtype=$2 where studentid=$3 and DATE(reportdate)=$4  RETURNING *',[mealtime, mealtype,studentId,formattedDateTime],(err,result)=>{
                                    if(err){
                                        console.log(err); 
                                    }
                                    else{
                                        console.log('allergy status updated');
                                    }
                                });  
                            }else if(reportType==3){
                                //update nap entry 
                                pool.query('update studentactivityreport set naptime=$1,napduration=$2 where studentid=$3 and DATE(reportdate)=$4  RETURNING *',[naptime,napduration,studentId,formattedDateTime],(err,result)=>{
                                    if(err){
                                        console.log(err); 
                                    }
                                    else{
                                        console.log('allergy status updated');
                                    }
                                });  
                            }
                            else if(reportType==4){
                                pool.query('update studentactivityreport set allergystatus=$1,allergydescription=$2 where studentid=$3 and DATE(reportdate)=$4  RETURNING *',[allergystatus,allergydescription,studentId,formattedDateTime],(err,result)=>{
                                    if(err){
                                        console.log(err); 
                                    }
                                    else{
                                        console.log('allergy status updated');
                                    }
                                });  
                            }else if(reportType==5){
                                pool.query('update studentactivityreport set notes=$1 where studentid=$2 and DATE(reportdate)=$3  RETURNING *',[notes,studentId,formattedDateTime],(err,result)=>{
                                    if(err){
                                        console.log(err); 
                                    }
                                    else{
                                        console.log('allergy status updated');
                                    }
                                });  
                            }
                        }
                    }
                });
                
            } else {
                console.log('record not found');
            }  
        }
    });        
    if(idx<idArray.length){
        idx++;
        manageReport(parseInt(idArray[idx]),data);
    }else{

    } 
}
const saveReport=async(req, res) =>{
    let studentId=req.body.studentId;
    idArray=studentId.toString().split(',');
    await manageReport(parseInt(idArray[idx]),req.body);
    res.status(200).json({
        statusCode:200,
        message:'report updated',
        status:true,
        data:[], 
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

const getFullReportBySchoolId=async(req,res)=>{
    console.log(req.query.id,'---',typeof(req.query.fromdate));
    const schoolId=parseInt(req.query.id);
    const fromDate=new Date(req.query.fromdate);
    const toDate=new Date(req.query.todate);
    await pool.query('select studentactivityreport.studentid,studentactivityreport.studentname,studentactivityreport.schoolname, studentactivityreport.roomname,studentactivityreport.parentname, studentactivityreport.reportdate,studentactivityreport.naptime,  studentactivityreport.napduration,studentactivityreport.mealtime,studentactivityreport.mealtype, studentactivityreport.notes,studentactivityreport.activity,studentactivityreport.checkuptime, studentactivityreport.checkupstatus,studentactivityreport.allergystatus,studentactivityreport.allergydescription from studentactivityreport inner join tblschool on tblschool.name=studentactivityreport.schoolname where tblschool.id=$1 AND studentactivityreport.reportdate>=$2 AND studentactivityreport.reportdate<=$3',[schoolId,fromDate,toDate],(err,result)=>{
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


module.exports={
    saveReport,getReport,getReportByDate,getReportByParentId,getReportByRoomId,
    getFullReportByRoomId,getTodayReportByParentId,getBirthReportBySchoolId,
    getContactReportBySchoolId,getFullReportBySchoolId
};