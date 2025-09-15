// lib/api.ts
"use client";

export const API_URL ="https://notes-app-vansh160205s-projects.vercel.app/";

export async function apiRequest(
  path: string,
  options: RequestInit = {},
  token?: string
) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
    console.log("[apiRequest] ->", { url: `${API_URL}${path}`, options, headers });


  if (!res.ok) {
    const body = await res.json();
    const errorMessage = body?.error || `API error: ${res.status}`;
    throw { status: res.status, body, message: errorMessage };
  }
  return res.json();
}
