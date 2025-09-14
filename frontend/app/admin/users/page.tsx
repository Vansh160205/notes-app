"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import Link from "next/link";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [error, setError] = useState<string | null>(null);

  const slug = user?.tenant.slug;

  const load = async () => {
    if (!user) return;
    try {
      const data = await apiRequest(`/tenants/${slug}/users`, {}, user.token);
      setUsers(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load users");
    }
  };

  const invite = async () => {
    setError(null);
    try {
      await apiRequest(
        `/tenants/${slug}/invite`,
        {
          method: "POST",
          body: JSON.stringify({ email, role }),
        },
        user?.token
      );
      setEmail("");
      await load();
    } catch (err: any) {
      setError(err?.body?.error || err?.message || "Invite failed");
    }
  };

  const changeRole = async (userId: string, newRole: string) => {
    try {
      await apiRequest(
        `/tenants/${slug}/users/${userId}/role`,
        {
          method: "PUT",
          body: JSON.stringify({ role: newRole }),
        },
        user?.token
      );
      await load();
    } catch (err: any) {
      setError(err?.body?.error || err?.message || "Change role failed");
    }
  };

  const removeUser = async (userId: string) => {
    try {
      await apiRequest(
        `/tenants/${slug}/users/${userId}`,
        { method: "DELETE" },
        user?.token
      );
      await load();
    } catch (err: any) {
      setError(err?.body?.error || err?.message || "Delete failed");
    }
  };

  useEffect(() => {
    load();
  }, [user]);

  if (!user) return <p>Please login</p>;

  if (user.role !== "ADMIN") return <p>Not authorized</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tenant Users</h1>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-sm shadow"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
          {error}
        </div>
      )}

      {/* Invite Form */}
      <div className="mb-6 bg-white shadow rounded-lg p-4 flex items-center gap-3">
        <input
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button
          onClick={invite}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
        >
          Invite
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr
                key={u.id}
                className={`border-t ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  {u.role}
                  {u.email === user.email && (
                    <span className="ml-2 text-xs text-gray-500">(You)</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  {u.email !== user.email && (
                    <>
                      <button
                        onClick={() =>
                          changeRole(
                            u.id,
                            u.role === "ADMIN" ? "MEMBER" : "ADMIN"
                          )
                        }
                        className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded shadow"
                      >
                        Toggle Role
                      </button>
                      <button
                        onClick={() => removeUser(u.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded shadow"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
