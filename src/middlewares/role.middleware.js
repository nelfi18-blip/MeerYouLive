export const isAdmin = (req, res, next) => {
  if ((req.userRole || "user") !== "admin") {
    return res.status(403).json({ message: "Admin requerido" });
  }
  next();
};
