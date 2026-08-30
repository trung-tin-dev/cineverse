import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";

export type Role = "CUSTOMER" | "STAFF" | "ADMIN";

// Mở rộng kiểu Request của Express để chứa user và session
declare global {
  namespace Express {
    interface Request {
      user?: typeof auth.$Infer.Session.user & {
        role?: Role;
      };
      session?: typeof auth.$Infer.Session.session;
    }
  }
}

/**
 * Middleware xác thực: Bắt buộc người dùng phải có Session hợp lệ
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({
        message: "Unauthorized: Bạn cần đăng nhập để truy cập tài nguyên này",
      });
    }

    req.user = session.user as any;
    req.session = session.session;
    next();
  } catch (error) {
    console.error("[Auth Middleware Error]:", error);
    return res.status(500).json({
      message: "Lỗi hệ thống trong quá trình xác thực phiên đăng nhập",
    });
  }
};

/**
 * Middleware phân quyền (RBAC): Kiểm tra quyền của người dùng theo danh sách Roles
 */
export const requireRole = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized: Vui lòng đăng nhập",
      });
    }

    const userRole = req.user.role as Role | undefined;

    if (!userRole) {
      return res.status(403).json({
        message: "Forbidden: User chưa được gán role",
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Forbidden: Bạn không có quyền truy cập. Yêu cầu quyền: [${allowedRoles.join(", ")}], quyền hiện tại của bạn: [${userRole}]`,
      });
    }

    next();
  };
};
