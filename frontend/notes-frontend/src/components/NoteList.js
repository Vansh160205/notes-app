import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    axios
      .get("http://localhost:8080/api/notes")
      .then((res) => setNotes(res.data))
      .catch((err) => console.error(err));
  };

  const addNote = () => {
    if (!title.trim() || !content.trim()) return;
    axios
      .post("http://localhost:8080/api/notes", { title, content })
      .then((res) => {
        setNotes([...notes, res.data]);
        setTitle("");
        setContent("");
      })
      .catch((err) => console.error(err));
  };

  const deleteNote = (id) => {
    axios
      .delete(`http://localhost:8080/api/notes/${id}`)
      .then(() => setNotes(notes.filter((note) => note.id !== id)))
      .catch((err) => console.error(err));
  };

  const shareNote = async (id) => {
    try {
      const res = await axios.post(`http://localhost:8080/api/notes/${id}/share`);
      alert(`✅ Note shared successfully! Public link: ${res.data.shareUrl}`);
      // You can also update note state if API returns updated note
      fetchNotes();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to share note");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">
          📝 Notes App
        </h1>

        {/* Add Note Form */}
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
              <p className="text-gray-600 mb-4">{note.content}</p>

              {/* Action Buttons */}
              <div className="flex gap-3">
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
              </div>

              {/* Show public link if note is shared */}
              {note.public && (
                <p className="mt-2 text-sm text-blue-600">
                  🔗 Public link: <a href={note.shareUrl} target="_blank" rel="noreferrer">{note.shareUrl}</a>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
