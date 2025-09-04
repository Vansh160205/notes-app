import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API from "../api"
function SharedNote() {
  const { slug } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    API
      .get(`/share/${slug}`)
      .then((res) => setNote(res.data))
      .catch((err) => console.error(err));
  }, [slug]);

  if (!note) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <div className="max-w-lg bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-indigo-600 mb-3">
          {note.title}
        </h1>
        <p className="text-gray-700">{note.content}</p>
        <p className="mt-4 text-gray-400 text-sm">📢 Shared Note</p>
      </div>
    </div>
  );
}

export default SharedNote;
