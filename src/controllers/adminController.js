let adminNotificationEnabled = true; // In-memory for demo; replace with DB in production

export const setAdminNotificationPreference = (req, res) => {
  const { enabled } = req.body;
  if (typeof enabled !== "boolean") {
    return res.status(400).json({ error: "'enabled' must be a boolean" });
  }
  adminNotificationEnabled = enabled;
  console.log("[ADMIN] Notification preference set to:", enabled);
  res.json({ success: true, enabled });
};

export const getAdminNotificationPreference = (req, res) => {
  res.json({ enabled: adminNotificationEnabled });
};

// Synchronous getter for use in other controllers
export const isAdminNotificationEnabled = () => adminNotificationEnabled;
