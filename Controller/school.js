const Pool=require("pg").Pool
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const AWS = require('./config');

// const pool=new Pool({
//     user:'postgres',
//     host:'localhost',
//     database:'dayCareDB',
//     password:'123456',
//     port:5432
// });

const pool=new Pool({
    user:'developer',
    host:'54.172.2.94',
    database:'daycare',
    password:'wP322$pSIdsc',
    port:5432
});

const getSchool=(req,res)=>{
    pool.query('select * from tblschool',(err,result)=>{
        if(err){console.log(err); throw err}
        res.status(200).json({
            message:'true',
            statusCode:200,
            status:true,
            data:result.rows
        });
    });
}

const getSchoolById=(req,res)=>{
    const id = parseInt(req.query.id);
    pool.query('select * from tblschool where id=$1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.status(200).json({
            message:'true',
            statusCode:200,
            status:true,
            data:result.rows
        });
    });
}

const deleteSchool=(req,res)=>{
    let id=0;
    if(req.query.id){
        id= parseInt(req.query.id);
    }else{
        id= parseInt(req.body.id);
    }
    pool.query('delete  from tblschool where id = $1', [id],(err,result)=>{
        if(err){
            res.status(400).json({
                message:'false',
                statusCode:400,
                data:[]
            });     
            console.log(err.message); 
        }else{
            res.status(200).json({
                message:'true',
                statusCode:200,
                data:result.rows
            }); 
        }
        
    });
}

const deleteSchoolWeb=(req,res)=>{
    let id=0;
    if(req.query.id){
        id= parseInt(req.query.id);
    }else{
        id= parseInt(req.body.id);
    }
    pool.query('delete  from tblschool where id = $1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.status(200).json({
            message:'true',
            statusCode:200,
            data:result.rows
        }); 
    });
}

const addSchool=async(req, res) =>{
    const{name, address,contact,email,bgcolor, forecolor, logo, websiteurl}=req.body;
    console.log(logo);
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
}
const editSchool=(req, res) =>{
    let id=0;
    if(req.query.id){
        id= parseInt(req.query.id);
    }else{
        id= parseInt(req.body.id);
    }
    const{name, address,contact,email,bgcolor, forecolor, logo, websiteurl}=req.body;
    console.log(req.body);
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
            pool.query('update tblschool set name=$1,address=$2,contact=$3,email=$4,bgcolor=$5,forecolor=$6, logo=$7, websiteurl=$8 where id='+id+' RETURNING *',[name, address,contact, email, bgcolor, forecolor, location, websiteurl],(err,result)=>{
                if(err){console.log(err); throw err}else{
                    res.status(200).json({
                        msg:'record Updated',
                        data:result.rows[0],
                    });
                }
            });
        }
    });
    
}


module.exports={
     getSchool,deleteSchool,deleteSchoolWeb,getSchoolById,addSchool,editSchool
}
