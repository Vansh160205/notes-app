import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import { SunIcon, MoonIcon } from "@heroicons/react/solid";

function SharedNote() {
  const { slug } = useParams();
  const [note, setNote] = useState(null);
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
    API.get(`/share/${slug}`)
      .then((res) => setNote(res.data))
      .catch((err) => console.error(err));
  }, [slug]);

  if (!note)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
        <p className="text-gray-600 dark:text-gray-300 text-lg">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <div className="max-w-3xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            🔗 Shared Note
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

        {/* Shared Note Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105 duration-200">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            {note.title}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">{note.content}</p>
          <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">
            📢 This is a shared note.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SharedNote;
