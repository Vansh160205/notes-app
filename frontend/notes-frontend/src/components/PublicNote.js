import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

function PublicNote() {
  const { slug } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    API.get(`/share/${slug}`).then(res => {setNote(res.data); console.log(res.data);});
  }, [slug]);

  if (!note) return <p>Loading...</p>;

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-2xl mx-auto mt-10">
      <h1>{note.title}</h1>
      <p>{note.content}</p>
    </div>
  );
}

export default PublicNote;
