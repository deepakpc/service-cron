import express from "express";
import filesController from "../controllers/files.mjs";

const router = express.Router();

router.post("/create", filesController.createFileDetails);

export default router;
