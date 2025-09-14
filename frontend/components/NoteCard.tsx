"use client";

import React from "react";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/api";

interface Note {
  id: string;
  title: string;
  content?: string;
  createdAt?: string;
}

interface NoteCardProps {
  note: Note;
  onDelete?: () => void;
  onEdit?: () => void; // ✅ new prop
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete, onEdit }) => {
  const { user } = useAuth();

  const handleDelete = async () => {
    if (!user) return;
    await apiRequest(`/notes/${note.id}`, { method: "DELETE" }, user.token);
    if (onDelete) onDelete();
  };

  return (
    <div className="p-4 border rounded flex justify-between items-start shadow-sm bg-white">
      <div>
        <h2 className="text-lg font-semibold">{note.title}</h2>
        {note.content && <p className="text-gray-600 mt-1">{note.content}</p>}
        {note.createdAt && (
          <p className="text-xs text-gray-400 mt-2">
            {new Date(note.createdAt).toLocaleString()}
          </p>
        )}
      </div>

      {user && (
        <div className="flex space-x-2">
          {/* ✅ Edit Button */}
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Edit
            </button>
          )}

          {/* ✅ Delete Button */}
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default NoteCard;
