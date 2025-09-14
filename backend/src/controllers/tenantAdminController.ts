import { Request, Response } from "express";
import prisma from "../../prisma/client";
import bcrypt from "bcrypt";

interface AuthReq extends Request {
  user?: { id: string; tenantId: string; role: string; email?: string };
}

/**
 * GET /tenants/:slug/users
 * List users for the tenant
 */
export const listUsers = async (req: AuthReq, res: Response) => {
  const { slug } = req.params;
  console.log("Listing users for tenant slug:", slug);
  const tenant = await prisma.tenant.findUnique({ where: { slug }});
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });

  // only allow same-tenant Admins
  if (req.user!.tenantId !== tenant.id) return res.status(403).json({ error: "Forbidden" });

  const users = await prisma.user.findMany({
    where: { tenantId: tenant.id },
    select: { id: true, email: true, role: true, createdAt: true },
  });
  console.log(users);
  res.json(users);
};

/**
 * POST /tenants/:slug/invite
 * body: { email, role? } (role default MEMBER)
 * For test submission we can create user directly with password "password"
 * For production, create an invite token and send email.
 */
export const inviteUser = async (req: AuthReq, res: Response) => {
  const { slug } = req.params;
  const { email, role = "MEMBER" } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const tenant = await prisma.tenant.findUnique({ where: { slug }});
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });
  if (req.user!.tenantId !== tenant.id) return res.status(403).json({ error: "Forbidden" });

  // if user exists, return 409
  const existing = await prisma.user.findUnique({ where: { email }});
  if (existing) return res.status(409).json({ error: "User already exists" });

  // for test purposes: create with default password "password"
  const hashed = await bcrypt.hash("password", 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      role: role.toUpperCase(),
      tenantId: tenant.id,
    },
    select: { id: true, email: true, role: true, createdAt: true }
  });

  // In production: create a One-Time Invite token and send email instead.
  res.status(201).json({ user });
};

/**
 * PUT /tenants/:slug/users/:userId/role
 * body: { role: "ADMIN" | "MEMBER" } 
 */
export const changeUserRole = async (req: AuthReq, res: Response) => {
  const { slug, userId } = req.params;
  const { role } = req.body;
  if (!role || !["ADMIN","MEMBER"].includes(role.toUpperCase())) {
    return res.status(400).json({ error: "Invalid role" });
  }

  const tenant = await prisma.tenant.findUnique({ where: { slug }});
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });
  if (req.user!.tenantId !== tenant.id) return res.status(403).json({ error: "Forbidden" });

  const u = await prisma.user.findUnique({ where: { id: userId }});
  if (!u || u.tenantId !== tenant.id) return res.status(404).json({ error: "User not found" });

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role: role.toUpperCase() },
    select: { id: true, email: true, role: true }
  });

  res.json({ user: updated });
};

/**
 * DELETE /tenants/:slug/users/:userId
 */
export const removeUser = async (req: AuthReq, res: Response) => {
  const { slug, userId } = req.params;
  const tenant = await prisma.tenant.findUnique({ where: { slug }});
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });
  if (req.user!.tenantId !== tenant.id) return res.status(403).json({ error: "Forbidden" });

  // you may block deleting yourself
  if (req.user!.id === userId) return res.status(400).json({ error: "Cannot delete yourself" });

  await prisma.user.deleteMany({ where: { id: userId, tenantId: tenant.id }});
  res.json({ success: true });
};

/**
 * GET /tenants/:slug
 * return tenant info (slug, plan)
 */
export const getTenantInfo = async (req: AuthReq, res: Response) => {
  const { slug } = req.params;
  console.log("Getting info for tenant slug:", slug);
  const tenant = await prisma.tenant.findUnique({ where: { slug }});
  console.log("Getting info for tenant slug:", slug);
  console.log("Found tenant:", tenant);
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });
  if (req.user!.tenantId !== tenant.id) return res.status(403).json({ error: "Forbidden" });
  res.json({ slug: tenant.slug, plan: tenant.plan });
};


//upgrade tenant plan
export const upgradeTenantPlan = async (req: AuthReq, res: Response) => {
  const { slug } = req.params;
  const tenant = await prisma.tenant.findUnique({ where: { slug }});
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });
  if (req.user!.tenantId !== tenant.id) return res.status(403).json({ error: "Forbidden" });
    if (tenant.plan === "PRO") {
    return res.status(400).json({ error: "Tenant is already on PRO plan" });
    }
    const updated = await prisma.tenant.update({
    where: { id: tenant.id },
    data: { plan: "PRO" },
    select: { id: true, slug: true, plan: true }
    });
    res.json({ tenant: updated });
    };
    