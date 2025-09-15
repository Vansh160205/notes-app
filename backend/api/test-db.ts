import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req:any, res:any) {
  try {
    const count = await prisma.user.count();
    res.status(200).json({ users: count });
  } catch (err:any) {
    res.status(500).json({ error: err.message });
  }
}
