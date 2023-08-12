
const Pool=require("pg").Pool

const pool=new Pool({
    user:'developer',
    host:'54.172.2.94',
    database:'daycare',
    password:'wP322$pSIdsc',
    port:5432
});

const chkLogin= async(req, res) =>{
    console.log('record to get ', req.body);
    const username=req.body.username;
    const userpassword=req.body.password;
    const devicetype=req.body.devicetype;
    const devicetoken=req.body.devicetoken;
    let schoolId='',principalId='';
    let userId=0;
    let userType='',name='';

    let responseData=[];
     pool.query(`select * from users where name=$1 and password=$2`, [username,userpassword],async(err,result)=>{
        if(err){console.log(err); throw err}else{
            if(result.rowCount>0){
                userType=result.rows[0].role;
                const reslt = await pool.query('insert into devicedetails(devicetype,devicetoken,username)values ($1,$2,$3)', [devicetype,devicetoken,username]);
                if(userType=='admin'){
                    const resultsub = await pool.query('SELECT id,schoolid,name FROM subadmin WHERE username = $1', [username]);
                    userId= resultsub.rows[0].id;
                    schoolId= resultsub.rows[0].schoolid;
                    name= resultsub.rows[0].name;
                    console.log(userId, schoolId);
                    let record={
                        id:userId,
                        schoolid:parseInt(schoolId),
                        usertype:userType,
                        username:name
                    }
                    responseData = record;
                }else if(userType=='staff'){
                    const resultsub = await pool.query('SELECT id,schoolid,principalid,name FROM tblstaff WHERE username = $1', [username]);
                    userId= resultsub.rows[0].id;
                    schoolId= resultsub.rows[0].schoolid;
                    principalId=resultsub.rows[0].principalid;
                    name= resultsub.rows[0].name;
                    console.log(userId, schoolId,principalId);
                    let record={
                        id:userId,
                        schoolid:parseInt(schoolId),
                        usertype:userType,
                        username:name,
                        principalid:principalId
                    }
                    responseData = record;
                }else if(userType=='parent'){
                    const resultsub = await pool.query('SELECT name,id,schoolid FROM parent WHERE username = $1', [username]);
                    userId= resultsub.rows[0].id;
                    schoolId= resultsub.rows[0].schoolid;
                    name= resultsub.rows[0].name;
                    let record={
                        id:userId,
                        schoolid:parseInt(schoolId),
                        username:name,
                        usertype:userType
                    }
                    responseData = record;
                    console.log(userId, schoolId,principalId);
                }
                console.log('responseData',responseData)
                res.status(200).json({
                    message:'true',
                    statusCode:200,
                    status:true,
                    data:responseData
                });
            }else{
                res.status(200).json({
                    message:'Invalid Username or Password',
                    statusCode:200,
                    status:false,
                    data:responseData
                });
                console.log('not matched ');
            }
        }
    });    
}

const chkUsername=async(req,res)=>{
    const username=req.body.username;
    pool.query('select * from users where name=$1',[username],(err,result)=>{
        if(err){console.log(err); throw err}else{
            if(result.rows>0){
                res.json({
                    message:'true',
                    statusCode:200,
                    status:true
                });
            }else{
                res.json({
                    message:'false',
                    statusCode:200,
                    status:false
                });
            }
        }
    });
}
module.exports={chkLogin,chkUsername};