const { getDashboardData } = require("../services/dashboardService");

const dashboard = async (req, res) => {

  try {

    const admin_id = req.user.user_id

    const data = await getDashboardData(admin_id);

    res.json({
      success: true,
      data
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data"
    })

  }

}

module.exports = {
    dashboard
}