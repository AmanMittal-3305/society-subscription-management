const residentOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" })
  }




  if (req.user.role !== "RESIDENT") {
    console.warn(`Access denied for role: ${req.user.role}. Expected: RESIDENT`);
    return res.status(403).json({ message: "Resident access only" })
  }

  next()
}

module.exports = residentOnly