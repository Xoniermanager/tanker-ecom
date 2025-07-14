import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./config/mongodb.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

connectDB()

app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send("Jai Sri Ram");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
