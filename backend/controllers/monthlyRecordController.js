const service = require("../services/monthlyRecordService");
const { createCurrentMonthRecord } = require("../services/monthlyRecordService")

exports.getRecords = async (req, res) => {
  try {
    const admin_id = req.user.user_id;
    const month = req.query.month;
    const page = parseInt(req.query.page) || 1
const limit = parseInt(req.query.limit) || 5

    if (!month) return res.status(400).json({ error: "month is required" });

    const records = await service.getMonthlyRecords(admin_id, month, page, limit);
    res.json(records);
  } catch (err) {
    console.error("Monthly Records Error:", err.message);
    res.status(500).json({ message: "Failed to fetch records" });
  }
};

exports.markPaid = async (req, res) => {
  try {
    const admin_id = req.user.user_id;
    const { record_id } = req.params;

    const result = await service.markAsPaid(record_id, admin_id);
    res.json(result);
  } catch (err) {
    console.error("Mark Paid Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};