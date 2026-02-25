import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();

const isGoogleOAuthConfigured = () =>
  !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

router.get("/google", (req, res, next) => {
  if (!isGoogleOAuthConfigured()) {
    return res.status(501).json({ message: "Google OAuth is not configured" });
  }
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

router.get("/google/callback", (req, res, next) => {
  if (!isGoogleOAuthConfigured()) {
    return res.status(501).json({ message: "Google OAuth is not configured" });
  }
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err || !user) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/error?message=Authentication failed`
      );
    }
    req.user = user;
    
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET not configured" });
    }

    try {
      const token = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.redirect(
        `${process.env.FRONTEND_URL}/auth/success?token=${token}`
      );
    } catch (err) {
      res.status(500).json({ message: "Error generating token" });
    }
  })(req, res, next);
});

export default router;
