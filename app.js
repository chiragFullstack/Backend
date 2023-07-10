const dotenv=require('dotenv');
const express=require('express');
const multer = require('multer');
const cors=require('cors');
const AWS = require('./Controller/config');

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
//this is the folder where we need to 
const storage = multer.memoryStorage();
const upload = multer({ storage });

// const upload = multer({ dest: 'uploads/',
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const extension = path.extname(file.originalname);
//         cb(null, file.fieldname + '-' + uniqueSuffix + extension);
//     }
// });
const pool=new Pool({
    user:'postgres',
    host:'localhost',
    database:'dayCareDB',
    password:'123456',
    port:5432
});



app.get('/',(req,res)=>{
    res.send('connected');
    console.log('connected with server ');
});

app.get('/allSchool',tblSchool.getSchool);
app.delete('/deleteSchool/:id',tblSchool.deleteSchool);
app.get('/schoolById/:id',tblSchool.getSchoolById);
app.post('/addSchool',upload.single('logo'),(req, res) =>{
    
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
      s3.upload(params, (err, data) => {
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



//code to connect with the subAdmin services 
app.get('/api/subadmin/subadminlist',tblSubadmin.getSubadmin);
app.delete('/api/subadmin/deleteSubadmin/:id',tblSubadmin.deleteSubadmin);
app.get('/api/subadmin/getSubadminById/:id',tblSubadmin.getSubadminById);
app.post('/api/subadmin/addSubadmin',upload.single('picurl'),(req, res) =>{
    const{name,contact,address,email,password,schoolid,picurl}=req.body;
    const userName=req.body.name;
    const userRole="subAdmin";
    const userPassword=""+req.body.password;
    pool.connect();
    pool.query('insert into users(name,role,password)values($1,$2,$3)RETURNING *',[userName,userRole,userPassword],(err,result)=>{
        if(err){console.log(err); throw err}
    });

    pool.query('insert into subadmin(name,contact,address,email,password,schoolid,picurl)values($1,$2,$3,$4,$5,$6,$7) RETURNING *',[name,contact,address,email,password,schoolid,picurl],(err,result)=>{
        if(err){console.log(err); throw err}else{
            res.status(200).json({
                msg:'record Inserted',
                data:result.rows[0],
            });
        }
    });    
});

app.put('/api/subadmin/editSubadmin/:id',upload.single('picurl'),(req, res) =>{
    const{name,contact,address,email,password,schoolid,picurl}=req.body;
    const id = parseInt(req.params.id);
    console.log(req.body);
    pool.connect();
    pool.query('update subadmin set name=$1,contact=$2,address=$3,email=$4,password=$5,schoolid=$6,picurl=$7 where id='+id+' RETURNING *',[name,contact,address,email,password,schoolid,picurl],(err,result)=>{
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
