"use client";

import { useEffect, useState } from "react";

type Todo = { _id: string; title: string; completed: boolean };

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    fetch("/api/todos")
      .then((res) => res.json())
      .then((data: Todo[]) => {
        if (!ignore) setTodos(data);
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

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Todo DevOps</h1>
      <form onSubmit={add} className="flex gap-2 mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
          className="flex-1 border rounded px-3 py-2"
        />
        <button className="bg-black text-white px-4 py-2 rounded">Add</button>
      </form>
      <ul className="space-y-2">
        {todos.map((t) => (
          <li key={t._id} className="flex items-center gap-3 border rounded px-3 py-2">
            <input type="checkbox" checked={t.completed} onChange={() => toggle(t)} />
            <span className={t.completed ? "line-through text-gray-400 flex-1" : "flex-1"}>
              {t.title}
            </span>
            <button onClick={() => remove(t._id)} className="text-red-500 text-sm">delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
