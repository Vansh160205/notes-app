import { Request, Response } from "express";
import prisma from "../../prisma/client";

export const getNotes = async (req: any, res: Response) => {
  const tenantId = req.user?.tenantId;
  const notes = await prisma.note.findMany({ where: { tenantId } });
  console.log(notes);
  res.json(notes);
};

export const createNote = async (req: any, res: Response) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

      const count = await prisma.note.count({
      where: { tenantId: req.user!.tenantId },
    });
    const tenant = await prisma.tenant.findUnique({
      where: { id: req.user!.tenantId },
    });
    if (count >= 3 && tenant?.plan === "FREE") {
      return res
        .status(403)
        .json({ error: "Free plan limit reached (max 3 notes per tenant)" });
    }

  const note = await prisma.note.create({
    data: {
      title,
      content,
      tenant: { connect: { id: req.user!.tenantId } },
      owner: { connect: { id: req.user!.userId } }
    },
  });

  res.status(201).json(note);
};

export const getNoteById = async (req: any, res: Response) => {
  const { id } = req.params;
  const tenantId = req.user?.tenantId;

  const note = await prisma.note.findFirst({ where: { id, tenantId } });
  if (!note) return res.status(404).json({ error: "Note not found" });

  res.json(note);
};

export const updateNote = async (req: any, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const tenantId = req.user?.tenantId;

  const note = await prisma.note.findFirst({ where: { id, tenantId } });
  if (!note) return res.status(404).json({ error: "Note not found" });

  const updatedNote = await prisma.note.update({
    where: { id },
    data: { title, content },
  });

  res.json(updatedNote);
};

export const deleteNote = async (req: any, res: Response) => {
  const { id } = req.params;
  const tenantId = req.user?.tenantId;
  console.log("Deleting note with id:", id, "for tenantId:", tenantId);

  const note = await prisma.note.findFirst({ where: { id, tenantId } });
  if (!note) return res.status(404).json({ error: "Note not found" });

  await prisma.note.delete({ where: { id } });
  res.status(204).send();
};
