import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  connectDB();
});
