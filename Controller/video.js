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



const getVideoByRoomId=async (req,res)=>{
    const id = parseInt(req.query.id);
    const currentDate=new Date();
   await pool.query('select tblvideo.roomid,tblvideo.schoolid,tblvideo.videourl,tblroom.name,tblvideo.videodate from tblvideo inner join tblclass on tblvideo.roomid=tblclass.id  where tblvideo.roomid=$1 ', [id],(err,result)=>{
        const videoData=[];
        if(err){console.log(err); throw err}
        else{
            const s3 = new AWS.S3();
            for(let x=0;x<result.rows.length;x++){
                let videourl='';
                let status=false;
                if(result.rows[x].videourl.toString()!=""){
                    const idx=result.rows[x].videourl.toString().lastIndexOf('/');
                    const Name=result.rows[x].videourl.toString().slice(idx+1,result.rows[x].videourl.toString().length); 
                    const params = {
                        Bucket: 'daycarevideo', // replace with your S3 bucket name
                        Key: Name,
                        Expires:364*24*60*60
                    };
                    const signedUrl =s3.getSignedUrl('getObject', params);
                    videourl=signedUrl;
                }else{
                    videourl='';
                }
                let rec={
                    'id':result.rows[x].id,
                    'roomName':result.rows[x].name,
                    'roomid':result.rows[x].roomid,
                    'schoolid':result.rows[x].schoolid,
                    'videourl':videourl,
                    'currentdate':result.rows[x].videourl
                }
                videoData.push(rec);
            }
            console.log(videoData);
        }
        res.status(200).json({
            message:'true',
            statusCode:200,
            data:videoData,
            status: true
        });
    });
}

const getVideoBySchoolId=async (req,res)=>{
    const id = parseInt(req.query.id);
    const currentDate=new Date();
   await pool.query('select tblvideo.roomid,tblvideo.schoolid,tblvideo.videourl,tblroom.name,tblvideo.videodate from tblvideo inner join tblclass on tblvideo.roomid=tblclass.id  where tblvideo.schoolid=$1 ', [id],(err,result)=>{
        const videoData=[];
        if(err){console.log(err); throw err}
        else{
            const s3 = new AWS.S3();
            for(let x=0;x<result.rows.length;x++){
                let videourl='';
                let status=false;
                if(result.rows[x].videourl.toString()!=""){
                    const idx=result.rows[x].videourl.toString().lastIndexOf('/');
                    const Name=result.rows[x].videourl.toString().slice(idx+1,result.rows[x].videourl.toString().length); 
                    const params = {
                        Bucket: 'daycarevideo', // replace with your S3 bucket name
                        Key: Name,
                        Expires:364*24*60*60
                    };
                    const signedUrl =s3.getSignedUrl('getObject', params);
                    videourl=signedUrl;
                }else{
                    videourl='';
                }
                let rec={
                    'id':result.rows[x].id,
                    'roomName':result.rows[x].name,
                    'roomid':result.rows[x].roomid,
                    'schoolid':result.rows[x].schoolid,
                    'videourl':videourl,
                    'currentdate':result.rows[x].videourl
                }
                videoData.push(rec);
            }
            console.log(videoData);
        }
        res.status(200).json({
            message:'true',
            statusCode:200,
            data:videoData,
            status: true
        });
    });
}


const recordVideo=async (req, res) =>{
    console.log(req.body);
    const{roomid,videourl,schoolId}=req.body;
    const file=req.file;
    const s3 = new AWS.S3();
    const currentDate=new Date();
    let filelocation= videourl;
    const params = {
        Bucket: 'daycarevideo', // replace with your S3 bucket name
        Key: file.originalname,
        Body: file.buffer,
      };
      await pool.query('select * from tblvideo where roomid=$1 and videodate=$2', [roomid,currentDate],(err1,result1)=>{
            if(err1){

            }else{
                if(result1.rows.length>0){
                    res.status(200).json({
                        statusCode:200,
                        status:false,
                        message:'already shared'
                    });
                }else{
                    s3.upload(params, async(err, data) => {
                        if (err) {
                          console.error(err);
                        } else {
                            console.log('file url',data.Location);
                            filelocation=data.Location;
                            const params1 = {
                                Bucket: 'daycarevideo', // replace with your S3 bucket name
                                Key: file.originalname,
                                Expires:364*24*60*60
                            };
                            const signedUrl =s3.getSignedUrl('getObject', params1);
                
                            pool.connect();
                            pool.query('insert into tblvideo(roomid,videourl,videodate,schoolid)values($1,$2,$3,$4) RETURNING *',[roomid,filelocation,currentDate,schoolId],(err,result)=>{
                                if(err){console.log(err); 
                                    res.status(err.code).json({
                                        statusCode:err.code,
                                        status:false,
                                        message:err.message
                                    });
                                }else{
                                    const record={
                                        'roomid':roomid,
                                        'schoolid':schoolId,
                                        'currentDate':currentDate,
                                        'videourl':signedUrl
                                    }
                                    res.status(200).json({
                                        statusCode:200,
                                        status:true,
                                        message:'record Inserted',
                                        data:record
                                    });
                                }
                            });  
                        }
                    });
                }
            }
      });     
};


const editVideo=(req, res) =>{
    console.log(req.body);
    const{roomid,videourl,schoolId}=req.body;
    let id=0;
    if(req.query.id){
        id= parseInt(req.query.id);
    }else{
        id= parseInt(req.body.id);
    }
    const file=req.file;
    const s3 = new AWS.S3();
    const currentDate=new Date();
    let filelocation= videourl;
    const params = {
        Bucket: 'daycarevideo', // replace with your S3 bucket name
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
            pool.query('update tblvideo set roomid=$1,videourl=$2,videodate=$3,schoolid=$4 where id=$5 RETURNING *',[roomid,filelocation,currentDate,schoolId,id],(err,result)=>{
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
                        message:'video Record Updated',
                        data:result.rows
                    });
                }
            });  
        }
    });
};

const deleteVideo=(req,res)=>{
    const id = parseInt(req.body.id);
    pool.query('delete  from tblvideo where id = $1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.status(200).json({
            message:'true',
            statusCode:200,
            data:result.rows,
            status: true 
        }); 
    });
}

module.exports={
    recordVideo,editVideo,getVideoByRoomId,getVideoBySchoolId,deleteVideo
}