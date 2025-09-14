"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function NotesPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [tenantPlan, setTenantPlan] = useState<"FREE" | "PRO">("FREE");

  const [mounted, setMounted] = useState(false);
  const [editingNote, setEditingNote] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Billing Modal State
  const [showBilling, setShowBilling] = useState(false);

  useEffect(() => setMounted(true), []);

  const showTempMsg = (msg: string, duration = 3000) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), duration);
  };

  const loadNotes = async () => {
    if (!user) return;
    try {
      const data = await apiRequest("/notes", {}, user.token);
      setNotes(data);

      const tenant = await apiRequest(
        `/tenants/${user.tenant.slug}/`,
        {},
        user.token
      );
      setTenantPlan(tenant.plan);

      setLimitReached(tenant.plan === "FREE" && data.length >= 3);
    } catch (err: any) {
      console.error("Failed to load notes:", err);
      setError("Failed to load notes");
    }
  };

  const addNote = async () => {
    if (!user) return;
    try {
      setError(null);
      await apiRequest(
        "/notes",
        { method: "POST", body: JSON.stringify({ title, content }) },
        user.token
      );
      setTitle("");
      setContent("");
      await loadNotes();
      showTempMsg("Note added successfully!");
    } catch (err: any) {
      console.error("Add note failed:", err);
      setError(err?.body?.error || err?.message || "Failed to add note");
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!user) return;
    try {
      await apiRequest(`/notes/${noteId}`, { method: "DELETE" }, user.token);
      loadNotes();
      showTempMsg("Note deleted successfully!");
    } catch (err: any) {
      console.error("Delete failed:", err);
      showTempMsg(err?.body?.error || err?.message || "Failed to delete note");
    }
  };

  const startEdit = (note: any) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const updateNote = async () => {
    if (!user || !editingNote) return;
    try {
      setError(null);
      await apiRequest(
        `/notes/${editingNote.id}`,
        {
          method: "PUT",
          body: JSON.stringify({ title: editTitle, content: editContent }),
        },
        user.token
      );
      setEditingNote(null);
      setEditTitle("");
      setEditContent("");
      await loadNotes();
      showTempMsg("Note updated successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err?.body?.error || "Failed to update note");
    }
  };

  useEffect(() => {
    if (mounted && user) loadNotes();
  }, [mounted, user]);

  if (!mounted) return null;
  if (!user) return <p>Please login first</p>;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">NotesApp</h1>
        <nav className="flex-1 space-y-4">
          <button className="flex items-center gap-2 font-medium text-blue-600">
            📒 Notes
          </button>
          {/* Team Members (Admin only) */}
          {user.role === "ADMIN" && (
            <button
              className="flex items-center gap-2 font-medium text-gray-700"
              onClick={() => router.push("/admin/users")}
            >
              👥 Team Members
            </button>
          )}
          <button
            onClick={() => setShowBilling(true)}
            className="flex items-center gap-2 font-medium text-gray-700"
          >
            💳 Billing & Plans
          </button>
        </nav>
        <div className="mt-auto text-sm text-gray-500">
          API Health: <span className="text-green-600">Operational</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">My Notes</h2>
            <p className="text-gray-500">Manage your personal and team notes</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-gray-200 rounded-full text-sm font-medium">
              {tenantPlan} Plan
            </span>
            <div className="text-right">
              <p className="font-medium">{user.email}</p>
              <p className="text-gray-500 text-sm">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Success toast */}
        {successMsg && (
          <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded mb-4">
            {successMsg}
          </div>
        )}

        {/* Free plan limit */}
        {limitReached && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-3 rounded mb-4 flex items-center justify-between">
            <span>Free plan limit reached!</span>
            {user.role === "ADMIN" && (
              <button
                onClick={async () => {
                  await apiRequest(
                    `/tenants/${user.tenant.slug}/upgrade`,
                    { method: "PUT" },
                    user.token
                  );
                  loadNotes();
                  showTempMsg("Tenant upgraded to PRO!");
                }}
                className="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Upgrade to Pro
              </button>
            )}
          </div>
        )}

        {/* Add/Edit Form */}
        <div className="flex gap-2 mb-6">
          {editingNote ? (
            <>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Edit title"
                className="border rounded px-3 py-2 flex-1"
              />
              <input
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Edit content"
                className="border rounded px-3 py-2 flex-1"
              />
              <button
                onClick={updateNote}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditingNote(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
                className="border rounded px-3 py-2 flex-1"
              />
              <input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Note content"
                className="border rounded px-3 py-2 flex-1"
              />
              <button
                onClick={addNote}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add
              </button>
            </>
          )}
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800 truncate">
                  {note.title}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(note)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-3 truncate">{note.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    note.tag === "work"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {note.tag || "personal"}
                </span>
                <span>Last edited just now</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Billing Modal */}
      {showBilling && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">
              {tenantPlan} Plan Features
            </h3>
            <ul className="space-y-2 text-gray-700">
              {tenantPlan === "FREE" ? (
                <>
                  <li>✅ Up to 3 notes</li>
                  <li>✅ Basic note editing</li>
                  <li>🚫 No team collaboration</li>
                  <li>🚫 Limited support</li>
                </>
              ) : (
                <>
                  <li>✅ Unlimited notes</li>
                  <li>✅ Team collaboration</li>
                  <li>✅ Priority support</li>
                  <li>✅ Advanced analytics</li>
                </>
              )}
            </ul>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowBilling(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
