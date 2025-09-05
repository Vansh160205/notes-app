import React, { useEffect, useState } from "react";
import API from "../api";
import { SunIcon, MoonIcon, PencilIcon, TrashIcon, ShareIcon } from "@heroicons/react/solid";

function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark/light mode class to <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    API.get("/notes")
      .then((res) => setNotes(res.data))
      .catch((err) => console.error(err));
  }, []);

  const addNote = () => {
    if (!title && !content) return;
    API.post("/notes", { title, content })
      .then((res) => {
        setNotes([...notes, res.data]);
        setTitle("");
        setContent("");
      })
      .catch((err) => console.error(err));
  };

  const deleteNote = (id) => {
    API.delete(`/notes/${id}`)
      .then(() => setNotes(notes.filter((n) => n.id !== id)))
      .catch((err) => console.error(err));
  };

  const shareNote = (id) => {
    API.post(`/notes/${id}/share`)
      .then((res) => {
        const updated = notes.map((n) =>
          n.id === id ? { ...n, ...res.data } : n
        );
        setNotes(updated);
        console.log(process.env.REACT_APP_URL,process.env.REACT_APP_API_URL);
        alert(`Share link: ${process.env.REACT_APP_URL}/share/${res.data.slug}`);
      })
      .catch((err) => console.error(err));
  };

  const openEditModal = (note) => {
    setEditNote(note);
    setIsEditing(true);
  };

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <div className="max-w-3xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            📝 Notes App
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition hover:ring-2 hover:ring-indigo-500 flex items-center gap-1"
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5 text-yellow-400" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-800" />
            )}
            <span className={`ml-1 text-sm ${darkMode ? "text-white" : "text-gray-800"}`}>
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
        </div>

        {/* Create Note */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 mb-6 transition-colors duration-500">
          <input
            className="w-full border rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full border rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="Note content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            onClick={addNote}
            className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition flex justify-center items-center gap-2"
          >
            Add Note
          </button>
        </div>

        {/* Notes List */}
        <div className="grid gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:shadow-xl transition transform hover:scale-105 duration-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {note.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">{note.content}</p>
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => deleteNote(note.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 flex items-center gap-1 transition"
                >
                  <TrashIcon className="h-4 w-4" /> Delete
                </button>
                <button
                  onClick={() => shareNote(note.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 flex items-center gap-1 transition"
                >
                  <ShareIcon className="h-4 w-4" /> Share
                </button>
                <button
                  onClick={() => openEditModal(note)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 flex items-center gap-1 transition"
                >
                  <PencilIcon className="h-4 w-4" /> Edit
                </button>
              </div>
              {note.public && note.slug && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  🔗 Shared at:{" "}
                  <a
                    href={`/share/${note.slug}`}
                    className="text-indigo-600 dark:text-indigo-400 underline"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md transition-colors duration-500">
            <h2 className="text-xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
              ✏️ Edit Note
            </h2>
            <input
              className="w-full border rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              value={editNote.title}
              onChange={(e) =>
                setEditNote({ ...editNote, title: e.target.value })
              }
            />
            <textarea
              className="w-full border rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
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
