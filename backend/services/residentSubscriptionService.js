const pool = require("../config/db");

const getPendingPayments = async (residentId) => {
  const client = await pool.connect();
  

  try {
    console.log("Hello");
    
  }catch(e) { 
    console.log(e);
    
  }
}

module.exports = {
    getPendingPayments
}