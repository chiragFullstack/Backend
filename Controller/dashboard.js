const Pool=require("pg").Pool
const moment = require('moment');
const AWS = require('./config');


const pool=new Pool({
    user:'developer',
    host:'54.172.2.94',
    database:'daycare',
    password:'wP322$pSIdsc',
    port:5432
});


async function getParentMessageCount(schoolId){
    const currentDate = new Date();
    const inputDate = moment(currentDate, "YYYY-MM-DD");
    // Convert to UTC
    const utcDate = inputDate.utc();
    // Format the UTC date
    const formattedUTCDate = utcDate.format('YYYY-MM-DD');
   
    return new Promise((resolve, reject) => {
        pool.query('select count(*) from tblmessage where schoolid=$1 and DATE(msgdate)=$2', [parseInt(schoolId), formattedUTCDate], (err, result) => {
            if (err) {
                console.log(err.message);
                reject(err);
            } else {
                // const obj = {};
                // obj["messageReport"] = result.rows[0].count;
                // activitySectionCount.push(obj);
                resolve(result.rows[0].count);
            }
        });
    });
}

async function getVideoCount(schoolId){
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    return new Promise((resolve, reject) => {
        pool.query('select count(*) from tblVideo where schoolid=$1 and DATE(videodate)=$2', [parseInt(schoolId), formattedDate], (err, result) => {
            if (err) {
                console.log(err.message);
                reject(err);
            } else {
            //     const obj = {};
            //     obj["videoReport"] = result.rows[0].count;

            //    // activitySectionCount.push(obj);

                resolve(result.rows[0].count);
                
            }
        });
    });
}
const activityCount= async(req,res)=>{
    const { schoolId } = req.query;
    const currentDate = new Date();
    const activitySectionCount = {};

    try {
        const activityPromise = pool.query('select count(studentactivityreport.studentname) from studentactivityreport inner join tblschool on tblschool.name=studentactivityreport.schoolname where tblschool.id=$1 and DATE(studentactivityreport.reportdate)=$2', [parseInt(schoolId), currentDate])
            .then(result => {
                activitySectionCount.activityCount = result.rows[0].count;
            });

        const videoPromise = getVideoCount(schoolId)
            .then(count => {
                activitySectionCount.videoCount = count;
            });

        const messagePromise = getParentMessageCount(schoolId)
            .then(count => {
                activitySectionCount.messageCount = count;
            });

        // Wait for all promises to resolve
        await Promise.all([activityPromise, videoPromise, messagePromise]);

        console.log(activitySectionCount);

        res.json({
            message: 'Activity Report',
            statusCode: 200,
            data: activitySectionCount,
            status: true
        });
    } catch (err) {
        console.log(err.message);
        throw err;
    }
}

const classCount = async (req, res) => {
    const { schoolId } = req.query;
    const recordData = [];
    console.log('record to get ', schoolId);
  await  pool.query('select count(*) from tblclass where schoolid=$1',[parseInt(schoolId)],(err,result)=>{
        if(err){console.log(err); throw err}else{
                console.log(result.rows[0].count);
                const obj = {}; // Ceate an empty object
                obj["classCount"] = result.rows[0].count; // Add the key-value pair to the object
                recordData.push(obj);
                pool.query('select count(*) from tblstudent where schoolid=$1',[parseInt(schoolId)],(err,result1)=>{
                    if(err){console.log(err); throw err}else{
                        console.log(result1.rows[0].count);
                            const obj = {}; // Ceate an empty object
                            obj["studentCount"] = result1.rows[0].count; // Add the key-value pair to the object
                            recordData.push(obj);
                            console.log(recordData);
                            res.json({
                                message:'Overview Record',
                                statusCode:200,
                                data:recordData,
                                status:false
                            });
                    }
                });
        }
    });
};

const getStudents = async (req, res) => {
    const { schoolId } = req.query;
    const recordData = [];

    await  pool.query('select id,studentname, roomid, picurl,gender from tblstudent where schoolid=$1',[parseInt(schoolId)],(err,result)=>{
        if(err){
            console.log(err);
            res.status(400).json({
                message:'Record is Empty',
                statusCode:400,
                data:[],
                status:false
            });
        }else{
            console.log(result.rows);
            
            const dataChild=[];
            const s3 = new AWS.S3();
            for(let x=0;x<result.rows.length;x++){
                const idx=result.rows[x].picurl.toString().lastIndexOf('/');
                const Name=result.rows[x].picurl.toString().slice(idx+1,result.rows[x].picurl.toString().length);
                console.log(Name);
                const params = {
                    Bucket: 'webdaycarebucket', // replace with your S3 bucket name
                    Key: Name,
                    Expires:364*24*60*60
                };
                const signedUrl =s3.getSignedUrl('getObject', params);
                pic_url=signedUrl;
                let rec={
                    'id':result.rows[x].id,
                    'name':result.rows[x].studentname,
                    'roomid':result.rows[x].roomid,
                    'picurl':pic_url,
                    'gender':result.rows[x].gender,
                }
                dataChild.push(rec);
            }
            console.log(dataChild);
            res.status(200).json({
                message:'Kids Data ',
                statusCode:200,
                data:dataChild,
                status:true
            });
        }
    });
}

const attendanceCount = async (req, res) => {
    const { schoolId } = req.query;
    const recordData = [];
    console.log('record to get ', schoolId);
    const currentDate = new Date();
    const inputDate = moment(currentDate, "YYYY-MM-DD");
    // Convert to UTC
    const utcDate = inputDate.utc();
    // Format the UTC date
    const formattedUTCDate = utcDate.format('YYYY-MM-DD');

  await  pool.query('select count(*) from tblstudent where schoolid=$1',[parseInt(schoolId)],(err,result)=>{
        if(err){console.log(err); throw err}else{
                console.log(result.rows[0].count);
                const obj = {}; // Ceate an empty object
                obj["totalStudent"] = result.rows[0].count; // Add the key-value pair to the object
                recordData.push(obj);
                pool.query('select   SUM(CASE WHEN attendence = true THEN 1 ELSE 0 END) AS true_count,SUM(CASE WHEN attendence = false THEN 1 ELSE 0 END) AS false_count from tblstudentcheckin where schoolid=$1 and attendencedate=$2 ',[parseInt(schoolId),formattedUTCDate],(err,result1)=>{
                    if(err){console.log(err); throw err}else{
                            const obj = {}; // Ceate an empty object
                            obj["presentCount"] = result1.rows[0].true_count?result1.rows[0].true_count:0; // Add the key-value pair to the object
                            obj["checkoutCount"] = result1.rows[0].false_count?result1.rows[0].false_count:0; // Add the key-value pair to the object
                            recordData.push(obj);
                            console.log(recordData);
                            res.json({
                                message:'Overview Record',
                                statusCode:200,
                                data:recordData,
                                status:false
                            });
                    }
                });
        }
    });
};
const countRatio = async (req, res) => {
    const { schoolId } = req.query;
    const recordData = [];
    console.log('record to get ', schoolId);
    const currentDate = new Date();
    const inputDate = moment(currentDate, "YYYY-MM-DD");
    // Convert to UTC
    const utcDate = inputDate.utc();
    // Format the UTC date
    const formattedUTCDate = utcDate.format('YYYY-MM-DD');

    try {
        const classResult = await pool.query('select id from tblclass where schoolid=$1', [parseInt(schoolId)]);

        for (let x = 0; x < classResult.rows.length; x++) {
            let obj = {};
            const studentResult = await pool.query('select count(tblstudentcheckin.id) as totalStudent from tblstudentcheckin inner join tblstudent on tblstudentcheckin.studentid=tblstudent.id where tblstudent.roomid=$1 and tblstudentcheckin.attendencedate=$2', [parseInt(classResult.rows[x].id), formattedUTCDate]);
            
            const staffResult = await pool.query('select count(tblstaffcheckin.id) as totalStaff from tblstaffcheckin inner join tblStaff on tblstaffcheckin.staffid=tblstaff.id where tblstaff.classid=$1 and tblstaffcheckin.attendencedate=$2', [parseInt(classResult.rows[x].id), formattedUTCDate]);

            let studentCount = 0;
            let staffCount = 0;
            console.log('student results---',studentResult.rows[studentResult.rows.length-1].totalStudent);
            
            if (studentResult.rows.length > 0) {
                let data=studentResult.rows;
                console.log('student results Data---',data[0].totalStudent);
                obj['studentCount'] = studentResult.rows;
                studentCount = studentResult.rows[0].totalStudent || studentResult.rows[0].totalstudent;
            }
            console.log('staff results---',staffResult.rows);
            if (staffResult.rows.length > 0) {
                obj['staffCount'] = staffResult.rows;
                staffCount = staffResult.rows[0].totalStaff;
            }

            
            obj['roomNo'] = classResult.rows[x].id;
            recordData.push(obj);
        }

        console.log(recordData);
        res.json({
            message: 'Ratio Data',
            statusCode: 200,
            data: recordData,
            status: true
        });
    } catch (err) {
        console.log(err);
        res.json({
            message: 'Check Error',
            statusCode: 400,
            data: [],
            status: false
        });
    }
};



  
module.exports={classCount,activityCount,getStudents,attendanceCount,countRatio};