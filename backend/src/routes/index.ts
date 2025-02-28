import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("🌍 Welcome to Globetrotter API");
});

export default router;