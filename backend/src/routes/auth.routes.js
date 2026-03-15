const { Router } = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const User = require("../models/User.js");

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Demasiadas solicitudes, intenta de nuevo más tarde" },
});

function signUserToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET environment variable");
  }

  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

router.get("/", async (_req, res) => {
  return res.status(200).json({
    ok: true,
    service: "meetyoulive-backend",
    message: "Backend activo",
  });
});

router.post("/register", authLimiter, async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "username, email y password son requeridos",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "La contraseña debe tener al menos 6 caracteres",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Usuario registrado",
      userId: user._id,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.post("/login", authLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "email y password son requeridos",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = signUserToken(user);

    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/google-session", async (req, res) => {
  const secret = req.headers["x-nextauth-secret"];
  const { email, name } = req.body;

  if (!process.env.NEXTAUTH_SECRET) {
    return res.status(500).json({
      message: "Missing NEXTAUTH_SECRET environment variable",
    });
  }

  if (secret !== process.env.NEXTAUTH_SECRET) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!email) {
    return res.status(400).json({ message: "email es requerido" });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      const baseUsername = (name || email.split("@")[0]).replace(/\s+/g, "").toLowerCase();
      const randomSuffix = crypto.randomBytes(3).toString("hex");
      const username = `${baseUsername}${randomSuffix}`;
      user = await User.create({
        username,
        name: name || email.split("@")[0],
        email,
        password: crypto.randomBytes(32).toString("hex"),
      });
    }

    const token = signUserToken(user);

    return res.status(200).json({
      ok: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name || user.username || "",
      },
    });
  } catch (err) {
    console.error("google-session error:", err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
