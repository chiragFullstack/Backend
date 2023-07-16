const Pool=require("pg").Pool
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const pool=new Pool({
    user:'postgres',
    host:'localhost',
    database:'dayCareDB',
    password:'123456',
    port:5432
});


const getStaff=(req,res)=>{
    pool.query('select * from tblstaff',(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        });
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
  };



const getStaffById=(req,res)=>{
    const id = parseInt(req.params.id);
    pool.query('select * from tblstaff where id=$1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        });
    });
}

const deleteStaff=(req,res)=>{
    const id = parseInt(req.params.id);
    pool.query('delete  from tblstaff where id = $1', [id],(err,result)=>{
        if(err){console.log(err); throw err}
        res.json({
            data:result.rows
        }); 
    });
}

module.exports={
     getStaff,deleteStaff,getStaffById,getPrincipalId
}
