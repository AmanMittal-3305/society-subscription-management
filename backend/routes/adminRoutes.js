const express = require("express")
const router = express.Router()

const flatController = require("../controllers/flatController")
const subscriptionController = require("../controllers/subscriptionController")
const { getProfile, updateProfile } = require("../controllers/adminProfileContoller")
const authMiddleware = require("../middleware/authMiddleWare")
const monthlyRecordController = require("../controllers/monthlyRecordController")
const paymentController = require("../controllers/paymentController")
const reportController = require("../controllers/reportController")
const { dashboard } = require("../controllers/dashboardController")
const adminOnly = require("../middleware/adminMiddleware")
const notificationController = require("../controllers/notificationController")

router.use(authMiddleware)
router.use(adminOnly)


router.get("/flats", flatController.getFlats)
router.post("/flats", flatController.createFlat)
router.get("/flats/available-residents", flatController.getAvailableResidents)
router.put("/flats/:id/assign-resident", flatController.assignResident)
router.get("/flats/:id", flatController.getFlatById)
router.post("/flats/:id/register-resident", flatController.registerResident)
router.put("/flats/:id", flatController.updateFlat)
router.delete("/flats/:id", flatController.deleteFlat)
router.put("/flats/:id/restore", flatController.restoreFlat)

router.get("/subscriptions", subscriptionController.getPlans)
router.get("/subscriptions/:id", subscriptionController.getPlanById)
router.post("/subscriptions", subscriptionController.createPlan)
router.put("/subscriptions/:id", subscriptionController.updatePlan)
router.delete("/subscriptions/:id", subscriptionController.deletePlan)

router.get("/monthly-records", monthlyRecordController.getRecords)

router.put("/monthly-records/:record_id/mark-paid", monthlyRecordController.markPaid)

router.get("/payment-entry", paymentController.getPaymentEntry)
router.post("/payment-entry", paymentController.createPaymentEntry)

router.get("/reports/monthly", reportController.getMonthlyReport)

router.get("/dashboard", dashboard)

router.get("/profile", getProfile)
router.put("/profile", updateProfile)

router.get("/notifications", notificationController.getNotifications);
router.post("/notifications", notificationController.sendNotification);

router.get("/residents", notificationController .getAllResidents)

module.exports = router