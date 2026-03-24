import api from "./api";

// Dashboard
export const getResidentDashboard = () =>
  api.get("/api/resident/dashboard");

// Subscriptions
export const getResidentSubscriptions = () =>
  api.get("/api/resident/subscriptions");

export const getSubscriptionDetail = (id: string) =>
  api.get(`/api/resident/subscriptions/${id}`);

// Notifications
export const getResidentNotifications = (page = 1, limit = 5) =>
  api.get(`/api/resident/notifications`, { params: { page, limit } });

export const markNotificationsRead = () =>
  api.put("/api/resident/notifications/read", {});

export const getUnreadCount = () =>
  api.get("/api/resident/notifications/unread");

// Payments
export const getPendingPayments = () =>
  api.get("/api/resident/pending-payments");

export const savePayment = (data: {
  record_id: string;
  payment_mode: string;
  transaction_id: string;
}) => api.post("/api/resident/pay-now", data);

// Profile
export const getResidentProfile = () =>
  api.get("/api/resident/profile");

export const updateResidentProfile = (data: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) => api.put("/api/resident/profile", data);

// Firebase token
export const saveFcmToken = (fcmToken: string) =>
  api.put("/api/resident/save-token", { token: fcmToken });