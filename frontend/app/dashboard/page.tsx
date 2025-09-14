"use client";

import { useAuth } from "@/lib/auth";
import Link from "next/link";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  if (!user) return <p>Please login first</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={logout}
          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm shadow"
        >
          Logout
        </button>
      </div>

      {/* User Info Card */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Welcome back 👋
        </h2>
        <p className="text-gray-600">
          Logged in as{" "}
          <span className="font-medium text-gray-800">{user.email}</span>
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Role:{" "}
          <span className="font-medium text-blue-600">{user.role}</span> | Tenant:{" "}
          <span className="font-medium text-green-600">{user.tenant.name}</span>
        </p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/notes"
          className="block bg-blue-600 hover:bg-blue-700 text-white text-center py-4 rounded-lg shadow-md font-medium transition"
        >
          📒 Manage Notes
        </Link>

        {user.role === "ADMIN" && (
          <Link
            href="/admin/users"
            className="block bg-green-600 hover:bg-green-700 text-white text-center py-4 rounded-lg shadow-md font-medium transition"
          >
            👥 Manage Users
          </Link>
        )}
      </div>
    </div>
  );
}
