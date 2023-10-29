require('dotenv').config();
const express=require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors=require('cors');
const nodemailer = require('nodemailer');

const http=require('http');
const socketIO=require('socket.io');

const app=express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const server=http.createServer(app);

const PORT=process.env.PORT||5000;
const Pool=require("pg").Pool


const chkCred=require('./routes/Login/login');
const checkUser=require('./routes/Login/checkusername');

const insertParent=require('./routes/Parent/addParent');
const editParent=require('./routes/Parent/editParent');
const listParent=require('./routes/Parent/parentList');
const deleteParent=require('./routes/Parent/deleteParent');
const getParentById=require('./routes/Parent/getParentById');
const getParentByRoomId=require('./routes/Parent/getParentByRoomId');

const allStaff=require('./routes/Staff/allStaff');
const deleteStaff=require('./routes/Staff/delete');
const getStaffById=require('./routes/Staff/getStaffById');
const getSchoolStaff=require('./routes/Staff/getSchoolStaff');
const addStaff=require('./routes/Staff/addStaff');
const editStaff=require('./routes/Staff/editStaff');

const allSchool=require('./routes/School/schoolList');
const deleteSchool=require('./routes/School/deleteSchool');
const getSchoolById=require('./routes/School/schoolById');
const addSchool=require('./routes/School/addSchool');
const  editSchool=require('./routes/School/editSchool');

const allService=require('./routes/Service/serviceList');
const deleteService=require('./routes/Service/deleteService');
const getServiceById=require('./routes/Service/serviceById');
const insertService=require('./routes/Service/insertService');
const editService=require('./routes/Service/editService');

const allRoom=require('./routes/Room/allRoom');
const deleteRoom=require('./routes/Room/deleteRoom');
const roomById=require('./routes/Room/roomById');
const roomBySchoolId=require('./routes/Room/roomBySchoolId');
const addRoom=require('./routes/Room/addRoom');
const editRoom=require('./routes/Room/editRoom');


const studentList=require('./routes/Student/studentList');
const deleteStudent=require('./routes/Student/deleteStudent');
const getStudentById=require('./routes/Student/getStudentById');
const getStudentByparentId=require('./routes/Student/getStudentByParentId');
const getStudentBySchoolId=require('./routes/Student/getStudentBySchoolId');
const getStudentByRoomId=require('./routes/Student/getStudentByRoomId');
const addStudent=require('./routes/Student/addStudent');
const editStudent=require('./routes/Student/editStudent');

const claimedServiceList=require('./routes/claimedService/claimedServiceList');
const deleteClaimedService=require('./routes/claimedService/deleteClaimedService');
const claimedServiceDetails=require('./routes/claimedService/claimedServiceDetails');
const deactivateService=require('./routes/claimedService/deactivateService');
const addNewService=require('./routes/claimedService/addClaimedService');
const editNewService=require('./routes/claimedService/editClaimedService');


const getSubadmin=require('./routes/Subadmin/getSubadmin');
const deleteSubadmin=require('./routes/Subadmin/deleteSubadmin');
const getSubadminById=require('./routes/Subadmin/getSubadminById');
const addSubadmin=require('./routes/Subadmin/addSubadmin');
const editSubadmin=require('./routes/Subadmin/editSubadmin');

const staffCheckIn=require('./routes/staffAttendence/staffCheckIn');
const staffCheckOut=require('./routes/staffAttendence/staffCheckOut');
const getstaffStatus=require('./routes/staffAttendence/getStaffStatus');
const staffAttendenceReport=require('./routes/staffAttendence/staffAttendenceReport');
const staffAttendenceCount=require('./routes/staffAttendence/getStaffAttdenceBySchoolId');


const addNotice=require('./routes/notice/addNotice');
const deleteNotice=require('./routes/notice/deleteNotice');
const editNotice=require('./routes/notice/editNotice');
const getNoticeBySchoolId=require('./routes/notice/noticeList');

const studentCheckIn=require('./routes/studentAttendence/studentCheckIn');
const studentCheckOut=require('./routes/studentAttendence/studentCheckOut');
const getStudentStatus=require('./routes/studentAttendence/getStudentStatus');
const getStudentReport=require('./routes/studentAttendence/getStudentAttendenceReport');
const studentAttendenceCount=require('./routes/studentAttendence/getStudentCountBySchoolId');


const addVideo=require('./routes/video/addVideo');
const editVideo=require('./routes/video/editVideo');
const getVideoByRoomId=require('./routes/video/getVideoByRoomId');
const getVideoBySchoolId=require('./routes/video/getVideoBySchoolId');
const deleteVideo=require('./routes/video/deleteVideo');

const getChatRoomId=require('./routes/chatmessage/getChatRoomId');



const addReport=require('./routes/studentActivityReport/addReport');
const getDailyreport=require('./routes/studentActivityReport/getDailyReport');
const getFullreport=require('./routes/studentActivityReport/getFullReport');
const getReportByParentId=require('./routes/studentActivityReport/getReportByParentId');
const getReportByRoomId=require('./routes/studentActivityReport/getReportByRoomId');
const getFullReportByRoomId=require('./routes/studentActivityReport/getFullReportByRoomId');
const getTodayReportByParentId=require('./routes/studentActivityReport/getTodayReportByParentId');
const getBirthReportBySchoolId=require('./routes/studentActivityReport/getBirthReportBySchoolId');
const getContactReportBySchoolId=require('./routes/studentActivityReport/getContactReportBySchoolId');
const getFullReportBySchoolId=require('./routes/studentActivityReport/ActivityReportByPassingSchoolId');


const classData=require('./routes/Overview/classActivity');
const activityData=require('./routes/Overview/activityReport');
const studentData=require('./routes/Overview/studentData');
const attendanceData=require('./routes/Overview/attendenceCount');

//this is the folder where we need to 
const storage = multer.memoryStorage();
const upload = multer({ storage });

const socketMsg=require('./Controller/message');

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 25,
    secure: false,
    ignoreTLS: true,
});


const pool=new Pool({
    user:'developer',
    host:'54.172.2.94',
    database:'daycare',
    password:'wP322$pSIdsc',
    port:5432
});

app.get('/',(req,res)=>{
    res.send('connected');
});


//api to check user name and password 
app.use('/api',chkCred);
app.use('/api',checkUser);


//parent module with routes 
app.use('/api/parent',insertParent);
app.use('/api/parent',editParent);
app.use('/api/parent',listParent);
app.use('/api/parent',deleteParent);
app.use('/api/parent',getParentById);
app.use('/api/parent',getParentByRoomId);


//api to manage Staff Member 
app.use('/api/staff',allStaff);
app.use('/api/staff',deleteStaff);
app.use('/api/staff',getStaffById);
app.use('/api/staff',getSchoolStaff);
app.use('/api/staff',addStaff);
app.use('/api/staff',editStaff);


//school module to manage the API with router 
app.use('/api/School',allSchool);
app.use('/api/School',deleteSchool);
app.use('/api/School',getSchoolById);
app.use('/api/School',addSchool);
app.use('/api/School',editSchool);


//service details 
app.use('/api/service',allService);
app.use('/api/service',deleteService);
app.use('/api/service',getServiceById);
app.use('/api/service',insertService);
app.use('/api/service',editService);


//rooms details 
app.use('/api/room',roomBySchoolId);
app.use('/api/room',addRoom);
app.use('/api/room',allRoom);
app.use('/api/room',deleteRoom);
app.use('/api/room',roomById);
app.use('/api/room',editRoom);


//code to connect with the student router 
app.use('/api/student',studentList);
app.use('/api/student',deleteStudent);
app.use('/api/student',getStudentById);
app.use('/api/student',getStudentByparentId);
app.use('/api/student',getStudentBySchoolId);
app.use('/api/student',getStudentByRoomId);
app.use('/api/student',addStudent);
app.use('/api/student',editStudent);
app.use('/api/student',studentAttendenceCount);
app.use('/api/student',studentCheckIn);
app.use('/api/student',studentCheckOut);
app.use('/api/student',getStudentStatus);
app.use('/api/student',getStudentReport);


//code to connect with the subAdmin services 
app.use('/api/subadmin',getSubadmin);
app.use('/api/subadmin',deleteSubadmin);
app.use('/api/subadmin',getSubadminById);
app.use('/api/subadmin',addSubadmin);
app.use('/api/subadmin',editSubadmin);

//code to connect with the claimed services 
app.use('/api/claimedService',claimedServiceList);
app.use('/api/claimedService',claimedServiceDetails);
app.use('/api/claimedService',deleteClaimedService);
app.use('/api/claimedService',deactivateService);
app.use('/api/claimedService',addNewService);
app.use('/api/claimedService',editNewService);

app.use('/api/message',getChatRoomId);



app.use('/api/report',addReport);
app.use('/api/report',getDailyreport);
app.use('/api/report',getFullreport);
app.use('/api/report',getReportByParentId);
app.use('/api/report',getReportByRoomId);
app.use('/api/report',getFullReportByRoomId);
app.use('/api/report',getTodayReportByParentId);
app.use('/api/report',getBirthReportBySchoolId);
app.use('/api/report',getContactReportBySchoolId);
app.use('/api/report',getFullReportBySchoolId);

app.use('/api/staff',staffCheckIn);
app.use('/api/staff',staffCheckOut);
app.use('/api/staff',getstaffStatus);
app.use('/api/staff',staffAttendenceReport);
app.use('/api/staff',staffAttendenceCount);


app.use('/api/Notice',addNotice);
app.use('/api/Notice',editNotice);
app.use('/api/Notice',deleteNotice);
app.use('/api/Notice',getNoticeBySchoolId);



app.use('/api/Dashboard',classData);
app.use('/api/Dashboard',activityData);
app.use('/api/Dashboard',studentData);
app.use('/api/Dashboard',attendanceData);

app.use('/api/video',addVideo);
app.use('/api/video',editVideo);
app.use('/api/video',deleteVideo);
app.use('/api/video',getVideoByRoomId);
app.use('/api/video',getVideoBySchoolId);



//set the working of the IO 
const io=socketIO(server,{
    cors:{
       origin:"http://54.172.2.94:8080/",
      //  origin:"http://localhost:3000/",
        methods:["GET","POST"]
    }
});

io.on("connection",(socket)=>{
    console.log('socket ID---',socket.id);
    //when()ever the users join the room 
    socket.on('join_room',async(data)=>{
        socket.join(data);
        console.log('socket Id ',socket.id,'--',data);
        //if admin or staff logged in then sender will be schoolid and reciever will be parent id 
        const{senderid,recieverid}=data; 
        const sendrid=parseInt(senderid);
        const recid=parseInt(recieverid);
        await pool.query('select * from tblmessage where senderid=$1 and recieverid=$2 or senderid=$3 and recieverid=$4',[sendrid,recid,recid,sendrid],(err,result)=>{
            if(err){console.log(err);
                return false;
            }else{
                io.to(socket.id).emit("receive_message",result.rows);
            }
        });
    });

    socket.on('send_message',async (data)=>{
        //whenever user hit the message button pass the data 
        ///staff and admin can chat with parents and their id will be consider as school id 
        console.log(data);

        const resp=socketMsg.saveMessage(data);
        
        const{senderid,message,recieverid}=data;

        const sendrid=parseInt(senderid);
        const recid=parseInt(recieverid);
        console.log(senderid,'----',recieverid);
        let json = [data]
        await pool.query('select * from tblmessage where senderid=$1 and recieverid=$2 or senderid=$3 and recieverid=$4',[sendrid,recid,recid,sendrid],(err,result)=>{
            if(err){console.log(err);
                return false;
            }else{
                io.to(socket.id).emit("receive_message",result.rows);
                console.log(result.rows,'send data to front end app ');
            }
        });
        //io.emit("receive_message",json);
    });
    //when the socket is disconnected 
    socket.on('disconnect',()=>{
        console.log('disconnected with the server ',socket.id);
    });
});

server.listen(PORT,()=>{
    console.log('server is running');
});



//nextval('testsubadmin'::regclass)
