const dashboardService = require("../services/residentDashboardService");

const getDashboard = async (req, res) => {
    try {
        const residentId = req.user.user_id || req.user.id;

        const data = await dashboardService.getResidentDashboard(residentId);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "No flat linked to resident"
            });
        }

        res.json({
            success: true,
            data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    getDashboard
};