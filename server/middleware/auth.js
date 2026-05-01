const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    console.log("❌ No Token Found");
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.user = decoded;
    next();
  } catch (err) {
    console.log("❌ Token Validation Failed");
    res.status(401).json({ msg: "Token is not valid" });
  }
};

const isAdmin = (req, res, next) => {
  console.log(`🔐 Checking Permissions for User: ${req.user.name} (Role: ${req.user.role})`);
  
  const role = String(req.user.role).toLowerCase();
  if (role === "admin") {
    console.log("✅ Admin Access Granted");
    next();
  } else {
    console.log(`🚫 Admin Access Denied. User Role is: ${req.user.role}`);
    res.status(403).json({ 
      msg: "Access denied. Admin only.", 
      currentRole: req.user.role 
    });
  }
};

module.exports = { protect, isAdmin };
