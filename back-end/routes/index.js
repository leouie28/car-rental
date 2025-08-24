import express from "express";
import adminCarRouter from "./admin/car.js";
import authRouter from "./auth.js";
import carRouter from "./car.js";
import adminMessageRouter from "./admin/message.js";
import messageRouter from "./message.js";
import prisma from "../lib/prismaClient.js";
import bookingRouter from "./booking.js";
import clientRouter from "./client.js";
import adminBookingRouter from "./admin/booking.js";

const router = express.Router();

router.post("/upload-image", async (req, res) => {
  try {
    const { base64 } = req.body;
    if (!base64) {
      return res.status(400).json({ error: "No image provided" });
    }
    const img = await prisma.image.create({
      data: { base64 },
    });

    res.status(200).json(img);
  } catch (error) {
    console.log("Error on /upload-image:", error);
    res.status(500).send("Server Error");
  }
});

router.use("/auth", authRouter);
router.use("/client", clientRouter);
router.use("/car", carRouter);
router.use("/booking", bookingRouter);
router.use("/message", messageRouter);

// admin routers
router.use("/admin/car", adminCarRouter);
router.use("/admin/message", adminMessageRouter);
router.use("/admin/booking", adminBookingRouter);

export default router;
