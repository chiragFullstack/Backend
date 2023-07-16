const dotenv=require('dotenv');
const express=require('express');
const multer = require('multer');
const cors=require('cors');
const AWS = require('./Controller/config');
const nodemailer = require('nodemailer');

const app=express();
dotenv.config();
app.use(cors());
app.use(express.json());
const PORT=process.env.PORT;
const Pool=require("pg").Pool


const tblSchool=require('./Controller/school');
const tblService=require('./Controller/schoolservice');
const tblSubadmin=require('./Controller/subAdmin');
const tblObtainedServcie=require('./Controller/serviceClaim');
const tblRoom=require('./Controller/room');
const tblStudent=require('./Controller/student');
const tblParent=require('./Controller/parent');
const tblStaff=require('./Controller/Staff');

//this is the folder where we need to 
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 25,
    secure: false,
    ignoreTLS: true,
});


//this method can be used to generate random password 
function generateRandomPassword(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }
    return password;
}

const pool=new Pool({
    user:'postgres',
    host:'localhost',
    database:'dayCareDB',
    password:'123456',
    port:5432
});

app.get('/',(req,res)=>{
    res.send('connected');
});

//manage the parent 
app.get('/api/Parent/allParent',tblParent.getParent);
app.delete('/api/Parent/deleteParent/:id',tblParent.deleteParent);
app.get('/api/Parent/ParentById/:id',tblParent.getParentById);
app.post('/api/Parent/addParent',upload.none(),(req, res) =>{
    const{name,contact,email,username,schoolId}=req.body;
    const userPassword=generateRandomPassword(12);
    console.log(req.body);
    pool.connect();
    const userName=req.body.username;
    const userRole="parent"; 
	pool.query('insert into users(name,role,password)values($1,$2,$3)RETURNING *',[userName,userRole,userPassword],(err,result)=>{
        if(err){console.log(err); throw err}
    });
    pool.query('insert into parent(name,contact,email,username,password,schoolid)values($1,$2,$3,$4,$5,$6) RETURNING *',[name,contact,email,username,userPassword,schoolId],(err,result)=>{
        if(err){console.log(err); throw err}else{
            res.status(200).json({
                msg:'record Inserted',
                data:result.rows[0],
            });
        }
    });    
});
app.put('/api/Parent/editParent/:id',upload.single('logo'),(req, res) =>{
    const id = parseInt(req.params.id);
    const{name,contact,email,username,password,schoolId}=req.body;
    console.log(req.body);
    pool.connect();
    pool.query('update parent set name=$1,contact=$2,email=$3,username=$4,password=$5,schoolid=$6 where id='+id+' RETURNING *',[name,contact,email,username,password,schoolId],(err,result)=>{
        if(err){console.log(err); throw err}else{
            res.status(200).json({
                msg:'record Updated',
                data:result.rows[0],
            });
        }
    });
});

//api to manage Staff Member 
app.get('/api/staff/allStaff',tblStaff.getStaff);
app.get('/api/staff/staffById/:id',tblStaff.getStaffById);
app.delete('/api/staff/deleteStaff/:id',tblStaff.deleteStaff);
app.get('/api/staff/getRoombySchool/:id',tblRoom.getRoomBySchoolId);
app.post('/api/staff/addStaff',upload.single('logo'),async(req, res) =>{
    const{name,contact,email,designation,schoolId,classId,userName}=req.body;
    const file = req.file;
    console.log(file);
    const s3 = new AWS.S3();
    let location='';
    let Password='';
    const params = {
        Bucket: 'webdaycarebucket', // replace with your S3 bucket name
        Key: file.originalname,
        Body: file.buffer,
      };
      s3.upload(params,async (err, data) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Image uploaded successfully:', data.Location);
          location=data.Location;
          pool.connect();
        let principalId=await tblStaff.getPrincipalId(parseInt(schoolId));
        const Principal_id=JSON.stringify(principalId[0].id);
        //console.log('to add staff get principal ID---',JSON.stringify(principalId[0].id));
        Password=generateRandomPassword(12);

        const userRole="staff"; 
        await pool.query('insert into users(name,role,password)values($1,$2,$3)RETURNING *',[userName,userRole,Password],(err,rsult)=>{
            if(err){console.log(err); throw err}
        });

      await pool.query('insert into tblstaff(name,contact,email,password,designation,schoolid,classid,principalid,picurl,username)values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',[name,contact,email,Password,designation,schoolId,classId,Principal_id,location,userName],(err,result)=>{
              if(err){console.log(err); throw err}else{
                  res.status(200).json({
                      msg:'record Inserted',
                      data:result.rows[0],
                  });
              }
          });
        }
      }); 
});


app.put('/api/staff/EditStaff/:id',upload.single('logo'),async(req, res) =>{
    const{name,contact,email,password,designation,schoolId,principalId,classId,userName}=req.body;
    const file = req.file;
    console.log(file);
    const s3 = new AWS.S3();
    let location='';
    const params = {
        Bucket: 'webdaycarebucket', // replace with your S3 bucket name
        Key: file.originalname,
        Body: file.buffer,
      };
      s3.upload(params,async (err, data) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Image uploaded successfully:', data.Location);
        //   const paramsUrl = {
        //     Bucket: 'webdaycarebucket',
        //     Key: key,
        //     Expires: expirationTimeSeconds
        //   };
          location=data.Location;
          pool.connect();

      await pool.query('update tblstaff set name=$1,contact=$2,email=$3,password=$4,designation=$5,schoolid=$6,classid=$7,principalid=$8,picurl=$9,username=$10 RETURNING *',[name,contact,email,password,designation,schoolId,classId,principalId,location,userName],(err,result)=>{
              if(err){console.log(err); throw err}else{
                  res.status(200).json({
                      msg:'record Inserted',
                      data:result.rows[0],
                  });
              }
          });
        }
      }); 
});



// list of the school to manage 
app.get('/allSchool',tblSchool.getSchool);
app.delete('/deleteSchool/:id',tblSchool.deleteSchool);
app.get('/schoolById/:id',tblSchool.getSchoolById);
app.post('/addSchool',upload.single('logo'), async(req, res) =>{
    const{name, address,contact,email,bgcolor, forecolor, logo, websiteurl}=req.body;
    const file = req.file;
    console.log(file);

    const s3 = new AWS.S3();
    let location="";
    const params = {
        Bucket: 'webdaycarebucket', // replace with your S3 bucket name
        Key: file.originalname,
        Body: file.buffer,
      };
      s3.upload(params, async(err, data) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Image uploaded successfully:', data.Location);
          location=data.Location;
          pool.connect();
          pool.query('insert into tblschool(name,address,contact,email,bgcolor, forecolor, logo, websiteurl)values($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',[name, address,contact, email, bgcolor, forecolor, location, websiteurl],(err,result)=>{
              if(err){console.log(err); throw err}else{
                  res.status(200).json({
                      msg:'record Inserted',
                      data:result.rows[0],
                  });
              }
          });
        }
      }); 
});
app.put('/editSchool/:id',upload.single('logo'),(req, res) =>{
    const id = parseInt(req.params.id);
    const{name, address,contact,email,bgcolor, forecolor, logo, websiteurl}=req.body;
    console.log(req.body);
    const image = req.file;
    console.log(image);
    pool.connect();
    pool.query('update tblschool set name=$1,address=$2,contact=$3,email=$4,bgcolor=$5,forecolor=$6, logo=$7, websiteurl=$8 where id='+id+' RETURNING *',[name, address,contact, email, bgcolor, forecolor, image, websiteurl],(err,result)=>{
        if(err){console.log(err); throw err}else{
            res.status(200).json({
                msg:'record Updated',
                data:result.rows[0],
            });
        }
    });
});



//service details 
app.get('/api/service/allService',tblService.getService);
app.delete('/api/service/deleteService/:id',tblService.deleteService);
app.get('/api/service/ServiceById/:id',tblService.getServiceById);
app.post('/api/service/addService',upload.none(),(req, res) =>{
    const{servicename,description}=req.body;
    console.log(req.body);
    pool.connect();
    pool.query('insert into tblservice(servicename,description)values($1,$2) RETURNING *',[servicename, description],(err,result)=>{
        if(err){console.log(err); throw err}else{
            res.status(200).json({
                msg:'record Inserted',
                data:result.rows[0],
            });
        }
    });    
});
app.put('/api/service/editService/:id',upload.none(),(req, res) =>{
    const id = parseInt(req.params.id);
    const{servicename,description}=req.body;
    console.log(req.body);
    pool.connect();
    pool.query('update tblservice set servicename=$1,description=$2 where id='+id+' RETURNING *',[servicename, description],(err,result)=>{
        if(err){console.log(err); throw err}else{
            res.status(200).json({
                msg:'record Updated',
                data:result.rows[0],
            });
        }
    });
});


//rooms details 
app.get('/api/room/allRoom',tblRoom.getRoom);
app.delete('/api/room/deleteRoom/:id',tblRoom.deleteRoom);
app.get('/api/room/roomById/:id',tblRoom.getRoomById);
app.post('/api/room/addRoom',upload.none(),(req, res) =>{
    const{name,schoolId,description}=req.body;
    console.log(req.body);
    pool.connect();
    pool.query('insert into tblclass(name,schoolid,description)values($1,$2,$3) RETURNING *',[name, schoolId,description],(err,result)=>{
        if(err){console.log(err); throw err}else{
            res.status(200).json({
                msg:'record Inserted',
                data:result.rows[0],
            });
        }
    });    
});

app.put('/api/room/editroom/:id',upload.none(),(req, res) =>{
    const id = parseInt(req.params.id);
    const{name,schoolId,description}=req.body;
    console.log(req.body);
    pool.connect();
    pool.query('update tblclass set name=$1,schoolid=$2,description=$3 where id='+id+' RETURNING *',[name,schoolId,description],(err,result)=>{
        if(err){console.log(err); throw err}else{
            res.status(200).json({
                msg:'record Updated',
                data:result.rows[0],
            });
        }
    });
});


//code to connect with the student 
app.get('/api/student/studentlist',tblStudent.getStudent);
app.delete('/api/student/deleteStudent/:id',tblStudent.deleteStudent);
app.get('/api/student/getStudentById/:id',tblStudent.getStudentById);
app.post('/api/student/addStudent',upload.single('picurl'),(req, res) =>{
    const{name,dateofbirth,contact,address,schoolid,roomid,parentid,picurl}=req.body;
    
    pool.connect(); 
   
    pool.query('insert into tblstudent(name,dateofbirth,contact,address,schoolid,roomid,parentid,picurl)values($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',[name,dateofbirth,contact,address,schoolid,roomid,parentid,picurl],(err,result)=>{
        if(err){console.log(err); throw err}else{
            res.status(200).json({
                msg:'record Inserted',
                data:result.rows[0],
            });
        }
    });    
});

app.put('/api/student/editStudent/:id',upload.single('picurl'),(req, res) =>{
    const{name,dateofbirth,contact,address,schoolid,roomid,parentid,picurl}=req.body;
    const id = parseInt(req.params.id);
    console.log(req.body);
    pool.connect();
    pool.query('update tblstudent set name=$1,dateofbirth=$2,contact=$3,address=$4,schoolid=$5,roomid=$6,parentid=$7,picurl=$8 where id='+id+' RETURNING *',[name,dateofbirth,contact,address,schoolid,roomid,parentid,picurl],(err,result)=>{
        if(err){console.log(err); throw err}else{
            res.status(200).json({
                msg:'record Updated',
                data:result.rows[0],
            });
        }
    });    
});


//code to connect with the subAdmin services 
app.get('/api/subadmin/subadminlist',tblSubadmin.getSubadmin);
app.delete('/api/subadmin/deleteSubadmin/:id',tblSubadmin.deleteSubadmin);
app.get('/api/subadmin/getSubadminById/:id',tblSubadmin.getSubadminById);
app.post('/api/subadmin/addSubadmin',upload.single('picurl'),(req, res) =>{
    const{name,contact,address,email,username,schoolid,picurl}=req.body;
    
    const userName=req.body.username;
    const userRole="subAdmin";
    const userPassword=""+generateRandomPassword(12);

    const mailOptions = {
        from: 'chiragmahajan9019@gmail.com',
        to: 'hk1898180@gmail.com',
        subject: 'Hello from Node.js',
        text: 'This is the body of the email.'
      };
      
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error occurred while sending email:', error.message);
        } else {
          console.log('Email sent successfully!');
          console.log('Message ID:', info.messageId);
        }
      });
      
    
    pool.connect();
    pool.query('insert into users(name,role,password)values($1,$2,$3)RETURNING *',[userName,userRole,userPassword],(err,result)=>{
        if(err){console.log(err); throw err}
    });
    
    pool.query('insert into subadmin(name,contact,address,email,username,password,schoolid,picurl)values($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',[name,contact,address,email,username,userPassword,schoolid,picurl],(err,result)=>{
        if(err){console.log(err); throw err}else{
            res.status(200).json({
                msg:'record Inserted',
                data:result.rows[0],
            });
        }
    });    
});

app.put('/api/subadmin/editSubadmin/:id',upload.single('picurl'),(req, res) =>{
    const{name,contact,address,email,username,password,schoolId,picurl}=req.body;
    const id = parseInt(req.params.id);
    console.log(req.body);
    pool.connect();
    pool.query('update subadmin set name=$1,contact=$2,address=$3,email=$4,username=$5,password=$6,schoolid=$7,picurl=$8 where id='+id+' RETURNING *',[name,contact,address,email,username,password,schoolId,picurl],(err,result)=>{
        if(err){console.log(err); throw err}else{
            res.status(200).json({
                msg:'record Updated',
                data:result.rows[0],
            });
        }
    });    
});


//code to connect with the claimed services 
app.get('/api/claimedService/claimedServiceList',tblObtainedServcie.getClaimService);
app.delete('/api/claimedService/deleteService/:id',tblObtainedServcie.deleteClaimedService);
app.get('/api/claimedService/ServiceById/:id',tblObtainedServcie.getClaimedServiceById);
app.post('/api/claimedService/claimedService',upload.none(),(req, res) =>{
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
});

app.put('/api/claimedService/editClaimedService/:id',upload.none(),(req, res) =>{
    const{serviceid,status,schoolid,obtainingdate}=req.body;
    const id = parseInt(req.params.id);
    console.log(req.body);
    pool.connect();
    pool.query('update obtainedservice set serviceid=$1,status=$2,schoolid=$3,obtainingdate=$4 where id='+id+' RETURNING *',[serviceid,status,schoolid,obtainingdate],(err,result)=>{
        if(err){console.log(err); throw err}else{
            res.status(200).json({
                msg:'record Updated',
                data:result.rows[0],
            });
        }
    });    
});

app.put('/api/claimedService/deactivateService/:id',upload.none(),(req, res) =>{
    const id = parseInt(req.params.id);
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
});

app.listen(PORT,()=>{
    console.log('server is running');
});
