const service = require("../services/paymentService")
const pool = require("../config/db");

// GET unpaid flats
const getPaymentEntry = async (req,res)=>{

  try{

    const admin_id = req.user.user_id
    const { month } = req.query

    const data = await service.getPaymentEntry(admin_id,month)

    res.json(data)

  }catch(err){

    console.error(err)

    res.status(500).json({
      message:"Failed to load payment entries"
    })

  }

}


// CREATE payment
const createPaymentEntry = async (req,res)=>{

  try{

    const admin_id = req.user.user_id

    const result = await service.createPaymentEntry(req.body,admin_id)

    res.json(result)

  }catch(err){

    console.error(err)

    res.status(500).json({
      message:"Payment entry failed"
    })

  }

}



const payNow = async (req, res) => {
  try {
    const resident_id = req.user.user_id;

    const { record_id, payment_mode } = req.body;

    if (!record_id) {
      return res.status(400).json({
        message: "record_id is required"
      });
    }

    const result = await service.payNow(
      {
        record_id,
        payment_mode
      },
      resident_id
    );

    res.json(result);

  } catch (e) {
    console.error(e);

    res.status(500).json({
      message: e.message
    });
  }
};


const getPendingPayments = async (req, res) => {
  try {
    const residentId = req.user.user_id; // from authMiddleware

    const result = await pool.query(
      `
      SELECT 
        mr.record_id, 
        mr.billing_month, 
        mr.amount, 
        mr.status, 
        f.flat_number,
        f.created_at
      FROM monthly_records mr
      JOIN flats f ON mr.flat_id = f.flat_id
      WHERE f.resident_id = $1
        AND mr.status != 'PAID'
      ORDER BY mr.billing_month DESC
      `,
      [residentId]
    );

    const pendingPayments = result.rows.map(r => ({
      ...r,
      month: new Date(r.billing_month).toLocaleString("en-IN", { month: "long" }),
      year: new Date(r.billing_month).getFullYear()
    }));

    res.json(pendingPayments); 

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch pending payments" });
  }
};

module.exports = {
  getPaymentEntry,
  createPaymentEntry,
  payNow, 
  getPendingPayments
}