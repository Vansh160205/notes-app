import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({ title: "", content: "" });

  useEffect(() => {
    if (id) {
      API.get(`/notes/${id}`).then(res => setNote(res.data));
    }
  }, [id]);

  const saveNote = async () => {
    if (id) {
      await API.put(`/notes/${id}`, note);
    } else {
      await API.post("/notes", note);
    }
    navigate("/");
  };

  return (
    <div>
      <h1>{id ? "Edit Note" : "New Note"}</h1>
      <input
        type="text"
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
        placeholder="Title"
      />
      <textarea
        value={note.content}
        onChange={(e) => setNote({ ...note, content: e.target.value })}
        placeholder="Content"
      />
      <button onClick={saveNote}>Save</button>
    </div>
  );
}

export default NoteEditor;
