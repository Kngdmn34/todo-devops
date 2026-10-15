"use client";

import { useEffect, useState } from "react";

type Todo = { _id: string; title: string; completed: boolean };

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetch("/api/todos")
      .then((res) => res.json())
      .then((data: Todo[]) => {
        if (!ignore) {
          setTodos(data);
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    setReloadKey((k) => k + 1);
  }

  async function toggle(t: Todo) {
    await fetch(`/api/todos/${t._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !t.completed }),
    });
    setReloadKey((k) => k + 1);
  }

  async function remove(id: string) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    setReloadKey((k) => k + 1);
  }

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white">
      {/* Decorative blurred blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-purple-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-500/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-500/20 blur-3xl" />

      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
              Todo DevOps
            </h1>
            <p className="mt-2 text-sm text-white/60">
              {todos.length === 0
                ? "Nothing here yet. Add your first task."
                : `${remaining} of ${todos.length} remaining`}
            </p>
          </div>

          {/* Glass card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
            {/* Add form */}
            <form onSubmit={add} className="mb-6 flex gap-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs doing?"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-purple-400/50 focus:bg-white/10 focus:ring-2 focus:ring-purple-400/20"
              />
              <button
                type="submit"
                disabled={!title.trim()}
                className="rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-5 py-3 font-medium text-white shadow-lg shadow-purple-500/30 transition hover:from-purple-400 hover:to-blue-400 hover:shadow-purple-500/50 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                Add
              </button>
            </form>

            {/* List */}
            <ul className="space-y-2">
              {loading && (
                <li className="py-8 text-center text-sm text-white/40">
                  Loading...
                </li>
              )}

              {!loading && todos.length === 0 && (
                <li className="py-12 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-2xl">
                    ✨
                  </div>
                  <p className="text-sm text-white/50">
                    No tasks yet. Add one above to get started.
                  </p>
                </li>
              )}

              {todos.map((t) => (
                <li
                  key={t._id}
                  className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3 transition hover:border-white/20 hover:bg-white/10"
                >
                  <button
                    onClick={() => toggle(t)}
                    aria-label={t.completed ? "Mark as incomplete" : "Mark as complete"}
                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
                      t.completed
                        ? "border-purple-400 bg-gradient-to-br from-purple-500 to-blue-500"
                        : "border-white/30 hover:border-purple-400"
                    }`}
                  >
                    {t.completed && (
                      <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>

                  <span
                    className={`flex-1 truncate transition ${
                      t.completed ? "text-white/40 line-through" : "text-white/90"
                    }`}
                  >
                    {t.title}
                  </span>

                  <button
                    onClick={() => remove(t._id)}
                    aria-label="Delete todo"
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-white/40 opacity-0 transition hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 0 0-.9.6L7.6 4H4a1 1 0 0 0 0 2h1v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2h-3.6l-.5-1.4A1 1 0 0 0 11 2H9zM7 8a1 1 0 0 1 2 0v6a1 1 0 1 1-2 0V8zm5-1a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-white/30">
            Built with Next.js · MongoDB · Docker · Fly.io
          </p>
        </div>
      </div>
    </main>
  );
}
