const Pool=require("pg").Pool;
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ dest: 'uploads/' });
const send_Email=require('../Controller/mail/Sendmail');

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

const getParentListBySchool=async(req,res)=>{
    const id = parseInt(req.query.id);
    console.log(id);
    const fullData = {};
    await pool.query('select parent.id,parent.name,parent.email, parent.contact,parent.username, parent.gender, parent.relation  from parent where parent.schoolId=$1', [id], (err, result) => {
        if (err) { console.log(err);}
        else {
            fullData["parent"] = result.rows
            pool.query('select * from tblstudent where parentid=$1', [id], (err, reslt) => {
                if (err) { console.log(err);
                    res.status(err.code).json({
                        message: err.message,
                        statusCode: err.code,
                        status: true,
                        data: fullData
                    });
                }else{
                    console.log(reslt.rows);
                    fullData["child"] = reslt.rows
                    res.status(200).json({
                        message: 'record fetched',
                        statusCode: 200,
                        status: true,
                        data: fullData
                    });
                }
            });
        }
    });
}

const getParentById=async (req,res)=>{
    const id = parseInt(req.query.id);
    console.log(id);
    const fullData = {};
    await pool.query('select parent.id,parent.name,parent.email, parent.contact,parent.username, parent.relation, parent.gender  from parent where parent.id=$1', [id], (err, result) => {
        if (err) { console.log(err); throw err }
        else {
            fullData["parent"] = result.rows
            pool.query('select * from tblstudent where parentid=$1', [id], (err, reslt) => {
                if (err) { console.log(err);
                    res.status(err.code).json({
                        message: err.message,
                        statusCode:err.code,
                        status: true,
                        data: fullData
                    });
                }else{
                    console.log(reslt.rows);
                    fullData["child"] = reslt.rows
                    res.status(200).json({
                        message: 'record fetched',
                        statusCode: 200,
                        status: true,
                        data: fullData
                    });
                }
            });
        }
    });
}

const deleteParent=(req,res)=>{
    let id=0;
    if(req.query.id){
        id= parseInt(req.query.id);
    }else{
        id= parseInt(req.body.id);
    }
    pool.query('delete  from parent where id = $1', [id],(err,result)=>{
        if(err){console.log(err);
            res.status(err.code).json({
                status:true,
                statusCode:err.code,
                message:err.message
            });
        }else{
            res.status(200).json({
                status:true,
                statusCode:200,
                message:'record Deleted',
                data:result.rows[0] 
            });
        }
    });
}



const insertParent=(req, res)=>{
    const{name,contact,email,username,schoolId,gender,relation}=req.body;
    const userPassword=generateRandomPassword(12);
    console.log(req.body);
    pool.connect();
    const userName=req.body.username;
    const userRole="parent"; 
    const fullData = {};
	pool.query('insert into users(name,role,password)values($1,$2,$3)RETURNING *',[userName,userRole,userPassword],(err,result)=>{
        if(err){console.log(err); throw err}
    });
    pool.query('insert into parent(name,contact,email,username,password,gender,relation,schoolid)values($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',[name,contact,email,username,userPassword,gender,relation,schoolId],(err,result)=>{
        if(err){console.log(err);
            res.status(err.code).json({
                status:true,
                statusCode:err.code,
                message:err.message
            });
        }else{
            send_Email.sendPassword(userPassword,email);
            fullData["parent"] = result.rows
            res.status(200).json({
                status:true,
                statusCode:200,
                message:'record Inserted',
                data:fullData
            });
        }
    });    
}

const editParent=(req, res) =>{
    let id=0;
    if(req.query.id){
        id= parseInt(req.query.id);
    }else{
        id= parseInt(req.body.id);
    }
    const{name,contact,email,username,schoolId,gender,relation}=req.body;
    console.log(req.body);
    pool.connect();
    const fullData = {};
    pool.query('update parent set name=$1,contact=$2,email=$3,username=$4,gender=$5,relation=$6, schoolid=$7 where id='+id+' RETURNING *',[name,contact,email,username,gender,relation,schoolId],(err,result)=>{
        if(err){console.log(err);
            res.status(err.code).json({
                statusCode:err.code,
                status:false,
                message:err.message,
            });
        }else{
            fullData["parent"] = result.rows
            console.log('fullData',fullData)
            res.status(200).json({
                statusCode:200,
                status:true,
                message:'record Updated',
                data:fullData,
            });
        }
    });
}

const getParentByRoomId=async (req,res)=>{
    const roomid = parseInt(req.query.roomid);
    const schoolId = parseInt(req.query.schoolId);
    console.log(roomid);
    const fullData = {};
    await pool.query('select parent.id  from parent inner join tblclass on tblclass.schoolid=parent.schoolid where tblclass.id=$1 and  parent.schoolid=$2', [roomid,schoolId], (err, result) => {
        if (err) { console.log(err);
            res.status(err.code).json({
                message: err.message,
                statusCode:err.code,
                status: true,
                data: fullData
            }); 
        }else {
                console.log(result.rows);
                    res.status(200).json({
                        message: 'record fetched',
                        statusCode: 200,
                        status: true,
                        data: result.rows
                    });
                }
        });
        
}

module.exports={
    getParentListBySchool,deleteParent,getParentById,insertParent,editParent,getParentByRoomId
}
