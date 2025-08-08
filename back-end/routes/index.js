import express from 'express';
const router = express.Router();
import adminCarRouter from './admin/car.js';
import authRouter from './auth.js';
import carRouter from './car.js';

// router.get('/', (req, res) => {
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]; // Bearer token
//     console.log('Authorization Header:', token)
//     res.json({ message: 'Hello from Express API!' });
// });

router.use("/auth", authRouter)
router.use("/car", carRouter)

// admin routers
router.use("/admin/car", adminCarRouter)

export default router