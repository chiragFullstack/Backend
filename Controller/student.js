const Pool=require("pg").Pool
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const AWS = require('./config');
const storage = multer.memoryStorage();

const pool=new Pool({
    user:'developer',
    host:'54.172.2.94',
    database:'daycare',
    password:'wP322$pSIdsc',
    port:5432
});

const getStudent=(req,res)=>{
    const id = parseInt(req.query.id);
    pool.query('select * from tblstudent ',(err,result)=>{
        if(err){console.log(err); throw err}
        res.status(200).json({
            message:'true',
            statusCode:200,
            data:result.rows,
            status: true
        });
    });
}
const deleteStudent=(req,res)=>{
    
    let id=0;
    if(req.query.id){
        id= parseInt(req.query.id);
    }else{
        id= parseInt(req.body.id);
    }
    pool.query('delete  from tblstudent where id = $1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.status(200).json({
            message:'true',
            statusCode:200,
            data:result.rows,
            status: true 
        }); 
    });
}

const getStudentById=(req,res)=>{
    const id = parseInt(req.query.id);
    pool.query('select tblstudent.id,tblstudent.dateofbirth,tblstudent.gender,tblstudent.studentname,tblstudent.parentid,tblstudent.schoolid,tblstudent.picurl,tblstudent.roomid,tblclass.name from tblstudent inner join tblclass on tblstudent.roomid=tblclass.id  where tblstudent.id=$1 ',[id],(err,result)=>{
        const dataChild=[];
        const currentDate=new Date();
        if(err){console.log(err); throw err}
        else{
            console.log('ok ',result.rows.length);
            const s3 = new AWS.S3();
            for(let x=0;x<result.rows.length;x++){
                let pic_url='';
                let status=false;
                pool.query('select attendence from tblstudentcheckin where studentid=$1 and attendencedate=$2',[parseInt(result.rows[x].id),currentDate],(err1,result1)=>{
                    if(err1){
                        status=false;
                    }else{
                        if(result1.rows.length>0){
                            status=result1.rows[0].attendence;
                        }else{
                            status=false;
                        }
                    }
                });
                console.log(result.rows[x].picurl);
                if(result.rows[x].picurl.toString()!=""){
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
                }else{
                    pic_url='';
                }
                let rec={
                    'id':result.rows[x].id,
                    'name':result.rows[x].studentname,
                    'parentid':result.rows[x].parentid,
                    'roomid':result.rows[x].roomid,
                    'schoolid':result.rows[x].schoolid,
                    'picurl':pic_url,
                    'roomname':result.rows[x].name,
                    'checkinStatus':status,
                    'dateofbirth':result.rows[x].dateofbirth,
                    'gender':result.rows[x].gender,
                }
                dataChild.push(rec);
            }
            console.log(dataChild);
        }
        res.status(200).json({
            message:'true',
            statusCode:200,
            data:dataChild,
            status: true
        });
    });
}

const getStudentByparentId=async (req,res)=>{
    const parentid = parseInt(req.query.id);
    const currentDate=new Date();
    pool.query('select tblstudent.id,tblstudent.studentname,tblstudent.parentid,tblstudent.schoolid,tblstudent.picurl,tblstudent.roomid,tblclass.name from tblstudent inner join tblclass on tblstudent.roomid=tblclass.id  where tblstudent.parentid=$1 ',[parentid],(err,result)=>{
        const dataChild=[];
        if(err){console.log(err); throw err}
        else{
            console.log('ok ',result.rows.length);
            const s3 = new AWS.S3();
            for(let x=0;x<result.rows.length;x++){
                let pic_url='';
                let status=false;
                pool.query('select attendence from tblstudentcheckin where studentid=$1 and attendencedate=$2',[parseInt(result.rows[x].id),currentDate],(err1,result1)=>{
                    if(err1){
                        status=false;
                    }else{
                        if(result1.rows.length>0){
                            status=result1.rows[0].attendence;
                        }else{
                            status=false;
                        }
                    }
                });
                console.log(result.rows[x].picurl);
                if(result.rows[x].picurl.toString()!=""){
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
                }else{
                    pic_url='';
                }
                let rec={
                    'id':result.rows[x].id,
                    'name':result.rows[x].studentname,
                    'parentid':result.rows[x].parentid,
                    'roomid':result.rows[x].roomid,
                    'schoolid':result.rows[x].schoolid,
                    'picurl':pic_url,
                    'roomname':result.rows[x].name,
                    'checkinStatus':status,
                    'dateofbirth':result.rows[x].dateofbirth,
                    'gender':result.rows[x].gender,
                }
                dataChild.push(rec);
            }
            console.log(dataChild);
        }
        res.status(200).json({
            message:'true',
            statusCode:200,
            data:dataChild,
            status: true
        });
    });
}


const getStudentByRoomId=(req,res)=>{
    const id = parseInt(req.query.id);
    const currentDate=new Date();
    pool.query('select tblstudent.id,tblstudent.studentname,tblstudent.parentid,tblstudent.schoolid,tblstudent.picurl,tblstudent.roomid,tblclass.name from tblstudent inner join tblclass on tblstudent.roomid=tblclass.id  where tblstudent.roomid=$1 ', [id],(err,result)=>{
        const dataChild=[];
        if(err){console.log(err); throw err}
        else{
            console.log('ok ',result.rows.length);
            const s3 = new AWS.S3();
            for(let x=0;x<result.rows.length;x++){
                let pic_url='';
                console.log(result.rows[x].picurl);
                let status=false;
                pool.query('select attendence from tblstudentcheckin where studentid=$1 and attendencedate=$2',[parseInt(result.rows[x].id),currentDate],(err1,result1)=>{
                    if(err1){
                        status=false;
                    }else{
                        if(result1.rows.length>0){
                            status=result1.rows[0].attendence;
                        }else{
                            status=false;
                        }
                    }
                });
                if(result.rows[x].picurl.toString()!=""){
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
                }else{
                    pic_url='';
                }
                let rec={
                    'id':result.rows[x].id,
                    'name':result.rows[x].studentname,
                    'parentid':result.rows[x].parentid,
                    'roomid':result.rows[x].roomid,
                    'schoolid':result.rows[x].schoolid,
                    'picurl':pic_url,
                    'roomname':result.rows[x].name,
                    'checkinStatus':status,
                    'dateofbirth':result.rows[x].dateofbirth,
                    'gender':result.rows[x].gender,
                }
                dataChild.push(rec);
            }
            console.log(dataChild);
        }
        res.status(200).json({
            message:'true',
            statusCode:200,
            data:dataChild,
            status: true 
        });
    });
}

let dataChild=[];
  let studentId=[];
  let studentStatus=[];
  let idx=0;


function getStudentCheckStatus(idx){
    console.log('above function ',idx);
    let id=parseInt(idx);
    let currentDate=new Date();
    let status=false;
    return new Promise((resolve, reject) => {
     pool.query('select * from tblstudentcheckin where studentid=$1',[id],(err1,result1)=>{
        if(err1){
            reject(err1);
            return;
        }else{
            if(result1.rows.length>0){
                status=result1.rows[0].attendence;
                resolve(status);
            }else{
                status=false;
                resolve(status);
            }
        }
    });
   });
}

const getStudentBySchoolId=async (req,res)=>{
    const id = parseInt(req.query.id);
    const currentDate=new Date();
    let count=0, totalRows=0;
    await pool.query('select tblstudent.id,tblstudent.studentname,tblstudent.parentid,tblstudent.schoolid,tblstudent.picurl,tblstudent.roomid,tblclass.name from tblstudent inner join tblclass on tblstudent.roomid=tblclass.id  where tblstudent.schoolid=$1',[id],(err,result)=>{
        if(err){console.log(err); throw err}
        else{
            if(result.rows.length>0){
            const s3 = new AWS.S3();
            totalRows=result.rows.length;
            console.log('total rows',totalRows);
            for(let x=0;x<result.rows.length;x++){
                count++;
                let pic_url='';
                let status=false;
                if(result.rows[x].picurl.toString()!=""){
                    const idx=result.rows[x].picurl.toString().lastIndexOf('/');
                    const Name=result.rows[x].picurl.toString().slice(idx+1,result.rows[x].picurl.toString().length); 
                    const params = {
                        Bucket: 'webdaycarebucket', // replace with your S3 bucket name
                        Key: Name,
                        Expires:364*24*60*60
                    };
                    const signedUrl =s3.getSignedUrl('getObject', params);
                    pic_url=signedUrl;
                }else{
                    pic_url='';
                }
                let Stustatus=getStudentCheckStatus(parseInt(result.rows[x].id));
                Stustatus.then((res)=>{
                    let rec={
                        'id':result.rows[x].id,
                        'name':result.rows[x].studentname,
                        'parentid':result.rows[x].parentid,
                        'roomid':result.rows[x].roomid,
                        'schoolid':result.rows[x].schoolid,
                        'picurl':pic_url,
                        'roomname':result.rows[x].name,
                        'dateofbirth':result.rows[x].dateofbirth,
                        'gender':result.rows[x].gender,
                        'checkIn':res
                    }
                    dataChild.push(rec);
                    console.log('status ---',rec);
                });
            }
            if(count==totalRows && count>0){
                console.log(count ,'below function--', totalRows);
                console.log('----',dataChild);
               let intervalId=setInterval(function(){
                    if(dataChild.length==totalRows){
                        res.status(200).json({
                            message:'true',
                            statusCode:200,
                            data:dataChild,
                            status: true
                        });
                        clearInterval(intervalId);
                    }
                },1000);       
            }
          }else{
            res.status(200).json({
                message:'no record found',
                statusCode:200,
                data:dataChild,
                status: true
            });
          }
        }
    });
    
}


const addStudent=(req, res) =>{
    console.log(req.body);
    const{name,dateofbirth,parentid,roomid,schoolId,logo,gender}=req.body;
    const file=req.file;
    console.log(file);
    const s3 = new AWS.S3();
    let filelocation= logo;
    const params = {
        Bucket: 'webdaycarebucket', // replace with your S3 bucket name
        Key: file.originalname,
        Body: file.buffer,
      };
      s3.upload(params, async(err, data) => {
        if (err) {
          console.error(err);
        } else {
            console.log('file url',data.Location);
            filelocation=data.Location;
            pool.connect();
            pool.query('insert into tblstudent(studentname,dateofbirth,schoolid,roomid,parentid,picurl,gender)values($1,$2,$3,$4,$5,$6,$7) RETURNING *',[name,dateofbirth,schoolId,roomid,parentid,filelocation,gender],(err,result)=>{
                if(err){console.log(err); 
                    res.status(err.code).json({
                        statusCode:err.code,
                        status:false,
                        message:err.message
                        
                    });
                }else{
                    res.status(200).json({
                        statusCode:200,
                        status:true,
                        message:'record Inserted',
                        data:result.rows
                    });
                }
            });  
        }
    });
};

const editStudent=(req, res) =>{
    const{name,dateofbirth,schoolid,roomid,parentid,logo,gender}=req.body;
    let id=0;
    if(req.query.id){
        id= parseInt(req.query.id);
    }else{
        id= parseInt(req.body.id);
    }
    
    const file=req.file;
    const s3 = new AWS.S3();
    let filelocation="";
    const params = {
        Bucket: 'webdaycarebucket', // replace with your S3 bucket name
        Key: file.originalname,
        Body: file.buffer,
      };
    s3.upload(params, async(err, data) => {
        if (err) {
          console.error(err);
        } else {
            console.log('file url',data.Location);
            filelocation=data.Location;
            pool.connect();
            pool.query('update tblstudent set studentname=$1,dateofbirth=$2,schoolid=$3,roomid=$4,parentid=$5,picurl=$6,gender=$7  where id='+id+' RETURNING *',[name,dateofbirth,schoolid,roomid,parentid,filelocation,gender],(err1,result)=>{
                if(err1){console.log(err1); 
                    res.status(err1.code).json({
                        statusCode:err1.code,
                        status:false,
                        message:err1.message
                        
                    });
                
                }else{
                    res.status(200).json({
                        statusCode:200,
                        status:true,
                        message:'record Updated',
                        data:result.rows[0],
                    });
                }
            });

        }
    });    
}
module.exports={
    getStudent,deleteStudent,getStudentById,getStudentBySchoolId,getStudentByRoomId,getStudentByparentId,addStudent,editStudent
}