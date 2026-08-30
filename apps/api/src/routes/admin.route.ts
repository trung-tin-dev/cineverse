import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";

const router = Router();

// Route Admin: Chỉ duy nhất ADMIN được phép truy cập
router.get(
  "/dashboard",
  requireAuth,
  requireRole("ADMIN"),
  (req, res) => {
    res.json({
      status: "success",
      message: "Chào mừng đến với Admin Management Portal",
      user: {
        id: req.user?.id,
        name: req.user?.name,
        email: req.user?.email,
        role: req.user?.role,
      },
      systemStats: {
        totalRevenue: "150,000,000 VND",
        totalUsers: 1250,
        activeTheaters: 8,
      },
    });
  },
);

export default router;
