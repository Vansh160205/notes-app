import React, { useEffect, useState } from "react";
import API from "../api"; // Import the axios instance

function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Edit modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editNote, setEditNote] = useState(null);

  // Load all notes
  useEffect(() => {
    API.get("/notes")
      .then((res) => setNotes(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Add new note
  const addNote = () => {
    API.post("/notes", { title, content })
      .then((res) => {
        setNotes([...notes, res.data]);
        setTitle("");
        setContent("");
      })
      .catch((err) => console.error(err));
  };

  // Delete note
  const deleteNote = (id) => {
    API.delete(`/notes/${id}`)
      .then(() => setNotes(notes.filter((n) => n.id !== id)))
      .catch((err) => console.error(err));
  };

  // Share note
  const shareNote = (id) => {
    API.post(`/notes/${id}/share`)
      .then((res) => {
        const updated = notes.map((n) =>
          n.id === id ? { ...n, ...res.data } : n
        );
        setNotes(updated);
        alert(`Share link: ${process.env.REACT_APP_API_URL}/share/${res.data.slug}`);
      })
      .catch((err) => console.error(err));
  };

  // Open edit modal
  const openEditModal = (note) => {
    setEditNote(note);
    setIsEditing(true);
  };

  // Save edited note
  const saveEdit = () => {
    API.put(`/notes/${editNote.id}`, editNote)
      .then((res) => {
        const updated = notes.map((n) =>
          n.id === editNote.id ? res.data : n
        );
        setNotes(updated);
        setIsEditing(false);
        setEditNote(null);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">
          📝 Notes App
        </h1>

        {/* Create Note */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
          <input
            className="w-full border rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full border rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Note content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            onClick={addNote}
            className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            Add Note
          </button>
        </div>

        {/* Notes List */}
        <div className="grid gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {note.title}
              </h2>
              <p className="text-gray-600">{note.content}</p>
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => deleteNote(note.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => shareNote(note.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
                >
                  Share
                </button>
                <button
                  onClick={() => openEditModal(note)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
              </div>
              {note.public && note.slug && (
                <p className="mt-2 text-sm text-gray-500">
                  🔗 Shared at:{" "}
                  <a
                    href={`/share/${note.slug}`}
                    className="text-indigo-600 underline"
                  >
                    /share/{note.slug}
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-indigo-600">
              ✏️ Edit Note
            </h2>
            <input
              className="w-full border rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={editNote.title}
              onChange={(e) =>
                setEditNote({ ...editNote, title: e.target.value })
              }
            />
            <textarea
              className="w-full border rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={editNote.content}
              onChange={(e) =>
                setEditNote({ ...editNote, content: e.target.value })
              }
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditNote(null);
                }}
                className="bg-gray-400 text-white px-3 py-1 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="bg-indigo-500 text-white px-3 py-1 rounded-lg hover:bg-indigo-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
