import express from "express";
import fileRouter from "./routes/file.mjs";

const PORT = 3000;
const app = express();

app.use(express.json({ limit: "10000kb" }));

app.use("/files", fileRouter);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.listen(PORT);
