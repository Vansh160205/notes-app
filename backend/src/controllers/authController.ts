import { Request, Response } from "express";
import prisma from "../../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const { email, password, tenantSlug } = req.body;

  if (!email || !password || !tenantSlug) {
    return res.status(400).json({ error: "Email, password, and tenantSlug are required" });
  }

  const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
  if (!tenant) return res.status(400).json({ error: "Invalid tenantSlug" });

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return res.status(400).json({ error: "User already exists" });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: passwordHash, role: "MEMBER", tenantId: tenant.id },
  });

  res.status(201).json({ id: user.id, email: user.email, tenantId: user.tenantId });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
    console.log(req.body);
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: "Invalid email or password" });
  
  const tenant = await prisma.tenant.findUnique({ where: { id: user.tenantId } });

  if (!tenant){
    console.log("Tenant not found for user:", user);
    return res.status(400).json({ error: "Tenant not found" });
    
    }

  console.log(user);
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return res.status(400).json({ error: "Invalid email or password" });

  const token = jwt.sign(
    { userId: user.id, tenantId: user.tenantId, role: user.role },
    process.env.JWT_SECRET || "supersecret",
    { expiresIn: "12h" }
  );
  console.log(token);
  res.json({ token ,user:user,tenant:tenant});
};


export const me = async (req: any, res:any) => {
  try {
    console.log(req.user);
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { tenant: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      userId: user.id,
      role: user.role,
      tenantId: user.tenantId,
      tenantSlug: user.tenant.slug,
      plan: user.tenant.plan,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
