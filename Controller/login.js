
const Pool=require("pg").Pool

const pool=new Pool({
    user:'developer',
    host:'54.172.2.94',
    database:'daycare',
    password:'wP322$pSIdsc',
    port:5432
});

const getUserDetails = async (username, userpassword, devicetype, devicetoken, res) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE name = $1 AND password = $2', [username, userpassword]);
  
      if (result.rowCount === 0) {
        return null; // User not found
      }
  
      const userType = result.rows[0].role;
      await pool.query('INSERT INTO devicedetails (devicetype, devicetoken, username) VALUES ($1, $2, $3)', [devicetype, devicetoken, username]);
  
      return { userType };
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  
  const getSubadminDetails = async (username, res) => {
    try {
      const result = await pool.query('SELECT id, schoolid, name FROM subadmin WHERE username = $1', [username]);
  
      if (result.rowCount === 0) {
        return null; // Subadmin not found
      }
  
      const { id, schoolid, name } = result.rows[0];
      return { id, schoolid: parseInt(schoolid), username: name, usertype: 'admin' };
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  
  const getStaffDetails = async (username, res) => {
    try {
      const result = await pool.query('SELECT id, schoolid, principalid, name FROM tblstaff WHERE username = $1', [username]);
  
      if (result.rowCount === 0) {
        return null; // Staff not found
      }
  
      const { id, schoolid, principalid, name } = result.rows[0];
      return { id, schoolid: parseInt(schoolid), principalid, username: name, usertype: 'staff' };
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  
  const getParentDetails = async (username, res) => {
    try {
      const result = await pool.query('SELECT id, schoolid, name FROM parent WHERE username = $1', [username]);
  
      if (result.rowCount === 0) {
        return null; // Parent not found
      }
  
      const { id, schoolid, name } = result.rows[0];
      return { id, schoolid: parseInt(schoolid), username: name, usertype: 'parent' };
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  
  const chkLogin = async (req, res) => {
    console.log('record to get ', req.body);
    const { username, password, devicetype, devicetoken } = req.body;
  
    try {
      const userDetails = await getUserDetails(username, password, devicetype, devicetoken, res);
  
      if (!userDetails) {
        return res.status(400).json({
          message: 'Invalid Username or Password',
          statusCode: 400,
          status: false,
          data: [],
        });
      }

      let responseData = [];
      if (userDetails.userType === 'admin') {
        const subadminDetails = await getSubadminDetails(username, res);
        responseData.push(subadminDetails);
      } else if (userDetails.userType === 'staff') {
        const staffDetails = await getStaffDetails(username, res);
        responseData.push(staffDetails);
      } else if (userDetails.userType === 'parent') {
        console.log('parent');
        const parentDetails = await getParentDetails(username, res);
        responseData.push(parentDetails);
      } else if (userDetails.userType === 'super admin') {
        responseData.push({
          id: 0,
          schoolid: 0,
          username,
          usertype: 'super admin',
        });
      } else {
        return res.status(400).json({
          message: 'Invalid Username or Password',
          statusCode: 400,
          status: false,
          data: [],
        });
      }
  
      res.status(200).json({
        message: 'true',
        statusCode: 200,
        status: true,
        data: responseData,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Internal Server Error',
        statusCode: 500,
        status: false,
        data: [],
      });
    }
  };
  



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