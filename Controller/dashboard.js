const Pool=require("pg").Pool

const pool=new Pool({
    user:'developer',
    host:'54.172.2.94',
    database:'daycare',
    password:'wP322$pSIdsc',
    port:5432
});

const classCount = async (req, res) => {
   
    const { schoolId } = req.query;
    const recordData = [];
    console.log('record to get ', schoolId);
  await  pool.query('select count(*) from tblclass where schoolid=$1',[parseInt(schoolId)],(err,result)=>{
        if(err){console.log(err); throw err}else{
                console.log(result.rows[0].count);
                const obj = {}; // Ceate an empty object
                obj["classCount"] = result.rows[0].count; // Add the key-value pair to the object
                recordData.push(obj);
                pool.query('select count(*) from tblstudent where schoolid=$1',[parseInt(schoolId)],(err,result1)=>{
                    if(err){console.log(err); throw err}else{
                        console.log(result1.rows[0].count);
                            const obj = {}; // Ceate an empty object
                            obj["studentCount"] = result1.rows[0].count; // Add the key-value pair to the object
                            recordData.push(obj);
                            console.log(recordData);
                            res.json({
                                message:'Overview Record',
                                statusCode:200,
                                data:recordData,
                                status:false
                            });
                    }
                });
        }
    });
};
  
  
module.exports={classCount};