const Pool=require("pg").Pool
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const AWS = require('./config');

const pool=new Pool({
    user:'developer',
    host:'54.172.2.94',
    database:'daycare',
    password:'wP322$pSIdsc',
    port:5432
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


const getSubadmin=(req,res)=>{
    pool.query('select * from subadmin',(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        });
    });
}
const deleteSubadmin=(req,res)=>{
    let id=0;
    if(req.query.id){
        id= parseInt(req.query.id);
    }else{
        id= parseInt(req.body.id);
    }
    pool.query('delete  from subadmin where id = $1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        }); 
    });
}

const getSubadminById=(req,res)=>{
    console.log(req.query.id);
    const id = parseInt(req.query.id);
    pool.query('select * from subadmin where id=$1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.status(200).json({
          status:true,
          msg:'record Details',
          data:result.rows,
      });
    });
}
const addSubadmin=(req, res) =>{
    const{name,contact,address,email,username,schoolid,picurl,gender}=req.body;    
    const userName=req.body.username;
    console.log(req.body);
    const userRole="subAdmin";
    const userPassword=""+generateRandomPassword(12);      
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
          pool.query('insert into users(name,role,password)values($1,$2,$3)RETURNING *',[userName,userRole,userPassword],(err,result)=>{
              if(err){console.log(err); throw err}
          });
          pool.query('insert into subadmin(name,contact,address,email,username,password,schoolid,picurl,gender)values($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',[name,contact,address,email,username,userPassword,schoolid,picurl,gender],(err,result)=>{
              if(err){console.log(err); 
                    res.status(400).json({
                        status:false,
                        msg:err.message,
                        data:[],
                    });
                }else{
                  res.status(200).json({
                        status:true,
                      msg:'record Inserted',
                      data:result.rows[0],
                  });
              }
          });    
        }
      });
   
}
const editSubadmin=(req, res) =>{
    const{name,contact,address,email,username,password,schoolId,picurl,gender}=req.body;
    let id=0;
    console.log(req.body);
    if(req.query.id){
        id= parseInt(req.query.id);
    }else{
        id= parseInt(req.body.id);
    }
    
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
          pool.query('update subadmin set name=$1,contact=$2,address=$3,email=$4,username=$5,password=$6,schoolid=$7,picurl=$8,gender=$9 where id='+id+' RETURNING *',[name,contact,address,email,username,password,schoolId,location,gender],(err,result)=>{
              if(err){console.log(err.message); 
                res.status(400).json({
                    status:false,
                    msg:'record Updated',
                    data:[],
                });
                }else{
                  res.status(200).json({
                      status:true,
                      msg:'record Updated',
                      data:result.rows[0],
                  });
                }
          });    
        }
      });
}



module.exports={
    getSubadmin,deleteSubadmin,getSubadminById,addSubadmin,editSubadmin
}