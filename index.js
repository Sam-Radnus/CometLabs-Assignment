import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet"
import path from "path"
import morgan from "morgan";
import { test, signup, login } from "./controllers/auth.js";
import { getProblemById,testAdmin,createProblem,listProblems, updateProblem, deleteProblem, createTestCase, submitSolution } from "./controllers/problem.js"
import { authMiddleware } from "./middleware/auth.js"
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }

).then(() => app.listen(PORT, () => console.log(`Server running on port:${PORT}`))).catch((error) => console.log(`${error.message}`))



/* ROUTES */
app.post("/api/signup", signup)
app.post("/api/login", login)
app.post("/api/test", test)
app.post("/api/questions/:questionId/submit", submitSolution)

/* ROUTES FOR ADMIN ONLY  */

app.post("/api/questions", authMiddleware, createProblem)
app.get("/api/questions/:questionId",authMiddleware,getProblemById)
app.get("/api/questions", authMiddleware, listProblems)
app.put("/api/questions/:questionId", authMiddleware, updateProblem)
app.delete("/api/questions/:questionId", authMiddleware, deleteProblem)
app.post("/api/questions/:questionId/testcases", authMiddleware, createTestCase)
