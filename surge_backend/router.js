import express from "express";
import { createSaleScript, getAllSaleScripts, getSaleScriptById } from "./controller.js";

const router = express.Router();

// Define routes
router.post("/create", createSaleScript);
router.get("/all", getAllSaleScripts);
router.get("/:id", getSaleScriptById);

export default router;