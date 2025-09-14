import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
    tenantId: number;
  };
}

export const authenticate = (roles: string[] = []) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log("Authenticating request...");
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });
    console.log(token);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      req.user = decoded;
      console.log(decoded);
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      console.log("auth successful");
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
};
