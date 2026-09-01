import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Route Staff: Chỉ cho phép STAFF và ADMIN
router.get(
  "/dashboard",
  requireAuth,
  requireRole("STAFF", "ADMIN"),
  (req, res) => {
    res.json({
      status: "success",
      message: "Chào mừng đến với Staff Portal (Quản lý suất chiếu & vé)",
      user: {
        id: req.user?.id,
        name: req.user?.name,
        email: req.user?.email,
        role: req.user?.role,
      },
      staffData: {
        activeShowtimes: 12,
        ticketsScannedToday: 145,
      },
    });
  },
);

export default router;
