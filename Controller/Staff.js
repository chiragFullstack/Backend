const Pool=require("pg").Pool
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

const getStaff=(req,res)=>{
    pool.query('select * from tblstaff',(err,result)=>{
        if(err){
            console.log(err); 
            res.status(err.code).json({
                status:false,
                statusCode:err.code,
                message:err.message,
            }); 
        }
        else{
            res.status(200).json({
                status:true,
                statusCode:200,
                message:'record deleted',
                data:result.rows
            }); 
        }
    });
}

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

const getSchoolStaff=(req,res)=>{
    console.log('scholllll id---',req.query.id);
    const id = parseInt(req.query.id);
    pool.query('select * from tblstaff where schoolid=$1',[id],(err,result)=>{
        if(err){
            console.log(err); 
            res.status(err.code).json({
                status:false,
                statusCode:err.code,
                message:err.message,
            }); 
        }
        else{
            res.status(200).json({
                status:true,
                statusCode:200,
                message:'record deleted',
                data:result.rows
            }); 
        }
    });
}

const getPrincipalId = async (schoolId) => {
    try {
      const result = await pool.query('SELECT id FROM subadmin WHERE schoolid = $1', [schoolId]);
      const principalId = result.rows;
      console.log('Principal ID:', principalId);
      return principalId; // Optionally, return the principalId
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
}


const addStaff=async(req,res) =>{
    const{name,contact,email,designation,schoolId,classId,picUrl,username,gender}=req.body;
    console.log(req.body);
    let location='';
    let Password='';
    pool.connect();
        let principalId=await getPrincipalId(parseInt(schoolId));
        const Principal_id=JSON.stringify(principalId[0].id);
        //console.log('to add staff get principal ID---',JSON.stringify(principalId[0].id));
        Password=generateRandomPassword(12);

        const userRole="staff"; 
        await pool.query('insert into users(name,role,password)values($1,$2,$3)RETURNING *',[username,userRole,Password],(err,rsult)=>{
            if(err){console.log(err); throw err}
        });

      await pool.query('insert into tblstaff(name,contact,email,password,designation,schoolid,classid,principalid,picurl,username,gender)values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',[name,contact,email,Password,designation,schoolId,classId,Principal_id,location,username,gender],(err,result)=>{
        if(err){
            console.log(err); 
            res.status(err.code).json({
                status:false,
                statusCode:err.code,
                message:err.message,
            }); 
        }
        else{
            send_Email.sendPassword(Password,email);
            res.status(200).json({
                status:true,
                statusCode:200,
                message:'record deleted',
                data:result.rows
            }); 
        }
        });
}


const editStaff=async(req, res)=>{
    
    let id=0;
    if(req.query.id){
        id= parseInt(req.query.id);
    }else{
        id= parseInt(req.body.id);
    }
    console.log('after clicking on edit button ', req.body);   
    const{name,contact,email,designation,schoolId,principalId,classId,picUrl,userName,gender}=req.body;
    const location='';
    await pool.query('update tblstaff set name=$1,contact=$2,email=$3,designation=$4,schoolid=$5,classid=$6,principalid=$7,picurl=$8,username=$9,gender=$10 where id='+id+'RETURNING *',[name,contact,email,designation,schoolId,classId,principalId,location,userName,gender],(err,result)=>{
        if(err){
            console.log(err); 
            res.status(err.code).json({
                status:false,
                statusCode:err.code,
                message:err.message,
            }); 
        }
        else{
            res.status(200).json({
                status:true,
                statusCode:200,
                message:'record deleted',
                data:result.rows
            }); 
        }
    });
}

const getStaffById=(req,res)=>{
    console.log('staff id ----',req.query.id);
    const id = parseInt(req.query.id);
    pool.query('select * from tblstaff where id=$1', [id],(err,result)=>{
        if(err){
            console.log(err); 
            res.status(err.code).json({
                status:false,
                statusCode:err.code,
                message:err.message,
            }); 
        }
        else{
            res.status(200).json({
                status:true,
                statusCode:200,
                message:'record deleted',
                data:result.rows
            }); 
        }
    });
}

const deleteStaff=(req,res)=>{
    let id=0;
    if(req.query.id){
        id= parseInt(req.query.id);
    }else{
        id= parseInt(req.body.id);
    }
    pool.query('delete  from tblstaff where id = $1', [id],(err,result)=>{
        if(err){
            console.log(err); 
            res.status(err.code).json({
                status:false,
                statusCode:err.code,
                message:err.message,
            }); 
        }
        else{
            res.status(200).json({
                status:true,
                statusCode:200,
                message:'record deleted',
                data:result.rows
            }); 
        }
        
    });
}

module.exports={
     getStaff,deleteStaff,getStaffById,addStaff,editStaff,getPrincipalId,getSchoolStaff
}
