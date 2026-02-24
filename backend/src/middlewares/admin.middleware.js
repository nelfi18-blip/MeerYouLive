import User from "../models/User.js";

export const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("role");
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Acceso denegado: se requiere rol admin" });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
