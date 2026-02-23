import User from "../models/User.js";

export const requireRole = (...roles) => async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("role");
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
