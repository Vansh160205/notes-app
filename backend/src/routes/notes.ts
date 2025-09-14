import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { getNotes, createNote, getNoteById, updateNote, deleteNote } from "../controllers/notesController";

const router = Router();

router.get("/", authenticate(), getNotes);
router.post("/", authenticate(), createNote);
router.get("/:id", authenticate(), getNoteById);
router.put("/:id", authenticate(["ADMIN", "MEMBER"]), updateNote);
router.delete("/:id", authenticate(["ADMIN","MEMBER"]), deleteNote);

export default router;
