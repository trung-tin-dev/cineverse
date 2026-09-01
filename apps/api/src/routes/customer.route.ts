import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Route Customer: Cho phép CUSTOMER, STAFF, ADMIN
router.get(
  "/profile",
  requireAuth,
  (req, res) => {
    res.json({
      status: "success",
      message: "Chào mừng bạn đến với Customer Portal CineVerse",
      user: {
        id: req.user?.id,
        name: req.user?.name,
        email: req.user?.email,
        role: req.user?.role,
      },
    });
  },
);

export default router;
