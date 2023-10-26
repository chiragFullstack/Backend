const Pool=require("pg").Pool
const moment = require('moment');
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
  
  
module.exports={classCount,activityCount};