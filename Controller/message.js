const Pool=require("pg").Pool;
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ dest: 'uploads/' });

const pool=new Pool({
    user:'developer',
    host:'54.172.2.94',
    database:'daycare',
    password:'wP322$pSIdsc',
    port:5432
});


const saveMessage=async(data)=>{
    const{senderid,message,recieverid, sendertype,roomid}=data;
    const msgdate=new Date().toISOString();
    console.log(data);
    let schoolid= roomid.split('_');
    let sender_id = parseInt(senderid)
    let parent_id = parseInt(schoolid[1])
    let reciever_id = parseInt(recieverid)
    let school_id=parseInt(schoolid[0]);
    pool.connect();
    pool.query('insert into tblmessage(senderid,message,recieverid,msgdate,sendertype,chatroomid,schoolid,parentid)values($1,$2,$3,$4,$5,$6,$7,$8)RETURNING *',[sender_id,message,reciever_id,msgdate,sendertype,roomid,school_id,parent_id],(err,result)=>{
        if(err){console.log(err);
          return false;
        }else{
            return result.rows;
        }
    });    
}

const getChatRoomId=async(req,res)=>{
    let id=parseInt(req.query.id);
    pool.query('select distinct tblmessage.chatroomid,tblmessage.parentid, parent.name from tblmessage inner join parent on parent.id=tblmessage.parentid where tblmessage.schoolid=$1',[id],(err,result)=>{
        if(err){console.log(err);
            res.status(400).json({
                message:err,
                statusCode:400,
                status:false
            });
        }else{
            res.status(200).json({
                message:err,
                statusCode:200,
                status:true,
                data: result.rows
            });
        }
    });
}


const getMessage=async(data)=>{
    const{senderid,message,recieverid}=data;
    const sendrid=parseInt(senderid);
    const recid=parseInt(recieverid);
    console.log(senderid,'----',recieverid);
    pool.query('select * from tblmessage where senderid=$1 and recieverid=$2',[sendrid,recid],(err,result)=>{
        if(err){console.log(err);
            return false;
        }else{
            console.log(result.rows);
            return result.rows;
        }
    });
}
module.exports={
    saveMessage,getMessage,getChatRoomId
}