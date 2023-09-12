const Pool = require("pg").Pool;
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ dest: 'uploads/' });

const pool = new Pool({
    user: 'developer',
    host: '54.172.2.94',
    database: 'daycare',
    password: 'wP322$pSIdsc',
    port: 5432
});
const getStudentStatus = async (req, res) => {
    const studentid = parseInt(req.query.id);
    console.log(studentid);
    const currentDate = new Date();
    await pool.query('select *  from tblstudentcheckin where studentid=$1 and attendenceDate=$2', [studentid, currentDate], (err, result) => {
        if (err) {
            console.log(err);
            res.status(err.code).json({
                status: true,
                statusCode: err.code,
                message: err.message
            });
        }
        else {
            res.status(200).json({
                status: true,
                statusCode: 200,
                message: 'Student Attendence Status',
                data: result.rows
            });
        }
    });
}


const studentCheckIn = async (req, res) => {
    const { studentid, schoolId, attendenceby, attendencefrom } = req.body;
    let student_id = parseInt(studentid);
    let school_id = parseInt(schoolId);
    let attendence_by = parseInt(attendenceby);
    console.log(req.body);
    pool.connect();
    const checkInStatus = true;
    const checkIndate = new Date();
    let count = 0;
    await pool.query('select *  from tblstudentcheckin where studentid=$1 and attendenceDate=$2', [studentid, checkIndate], (err1, result1) => {
        if (err1) {

        } else {
            if (result1.rows.length == 0) {
                pool.query('insert into tblstudentcheckin(studentid,schoolid,attendence,attendencedate,attendenceby,attendencefrom)values($1,$2,$3,$4,$5,$6) RETURNING *', [student_id, school_id, checkInStatus, checkIndate, attendence_by, attendencefrom], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(err.code).json({
                            status: false,
                            statusCode: err.code,
                            message: err.message
                        });
                    } else {
                        res.status(200).json({
                            status: true,
                            statusCode: 200,
                            message: 'student attendence Recorded',
                            data: result.rows
                        });
                    }
                });

            } else {

                const checkInStatus = true;
                const checkIndate = new Date();
                pool.query('update tblstudentcheckin set attendence=$1 where studentid=$2 and attendencedate=$3 RETURNING *', [checkInStatus, student_id, checkIndate], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(err.code).json({
                            status: true,
                            statusCode: err.code,
                            message: err.message
                        });
                    } else {
                        res.status(200).json({
                            status: true,
                            statusCode: 200,
                            message: 'student attendence Recorded updated',
                            data: result.rows
                        });
                    }
                });

            }
        }
    });

}



const studentCheckOut = (req, res) => {
    const { studentid, schoolId } = req.body;
    let student_id = parseInt(studentid);
    // let school_id=parseInt(schoolid);
    console.log(req.body);
    pool.connect();
    const checkInStatus = false;
    const checkIndate = new Date();
    pool.query('update tblstudentcheckin set attendence=$1 where studentid=$2 and attendencedate=$3 RETURNING *', [checkInStatus, student_id, checkIndate], (err, result) => {
        if (err) {
            console.log(err);
            res.status(err.code).json({
                status: true,
                statusCode: err.code,
                message: err.message
            });
        } else {
            res.status(200).json({
                status: true,
                statusCode: 200,
                message: 'student attendence Recorded updated',
                data: result.rows
            });
        }
    });
}

const getStudentAttendenceReport = async (req, res) => {
    const studentid =parseInt(req.query.id);
    const fromDate=req.query.fromdate;
    const toDate=req.query.todate;
    let qry='';
    if(studentid!='' && fromDate!='' && toDate==''){
        await pool.query('select *  from tblstudentcheckin where studentid=$1 and attendenceDate=$2', [studentid,fromDate],(err, result) => {
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
    if(studentid!='' && fromDate!='' && toDate!=''){
        await pool.query('select *  from tblstudentcheckin where studentid=$1 and attendenceDate>$2 and attendenceDate<$3', [studentid,fromDate,toDate],(err, result) => {
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

const getStudentReportBySchoolId = async (req, res) => {
    const schoolid =parseInt(req.query.id);
    const fromDate=req.query.fromdate;
    const toDate=req.query.todate;
    
    if(schoolid!='' && fromDate!='' && toDate!=''){
        await pool.query('select tblstudentcheckin.studentid,tblstudent.studentname,tblclass.name as roomname, count(tblstudentcheckin.attendence) as totalAttendence from tblstudentcheckin  inner join tblstudent  on tblstudent.id=tblstudentcheckin.studentid inner join tblclass on tblstudent.roomid=tblclass.id where tblstudentcheckin.schoolid=$1 and attendencedate>=$2 and attendencedate<=$3 and tblstudentcheckin.attendence=true group by  tblstudent.studentname,tblstudentcheckin.studentid,tblclass.name', [schoolid,fromDate,toDate],(err, result) => {
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

module.exports = {
    studentCheckIn, studentCheckOut, getStudentStatus,getStudentAttendenceReport,getStudentReportBySchoolId
}
