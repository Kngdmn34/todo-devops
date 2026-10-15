import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { GET, POST } from "@/app/api/todos/route";
import { PATCH, DELETE } from "@/app/api/todos/[id]/route";
import { connectDB } from "@/lib/mongodb";
import { Todo } from "@/models/Todo";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

beforeEach(async () => {
  await Todo.deleteMany({});
});

describe("POST /api/todos", () => {
  it("creates a todo", async () => {
    const req = new Request("http://localhost/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "write tests" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body.title).toBe("write tests");
    expect(body.completed).toBe(false);
    expect(body._id).toBeDefined();
  });

  it("rejects missing title", async () => {
    const req = new Request("http://localhost/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("trims whitespace from title", async () => {
    const req = new Request("http://localhost/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "   padded   " }),
    });
    const res = await POST(req);
    const body = await res.json();
    expect(body.title).toBe("padded");
  });
});

describe("GET /api/todos", () => {
  it("returns empty array initially", async () => {
    const res = await GET();
    const body = await res.json();
    expect(body).toEqual([]);
  });

  it("returns todos in reverse chronological order", async () => {
    await Todo.create({ title: "first" });
    await new Promise((r) => setTimeout(r, 20));
    await Todo.create({ title: "second" });

    const res = await GET();
    const body = await res.json();
    expect(body).toHaveLength(2);
    expect(body[0].title).toBe("second");
    expect(body[1].title).toBe("first");
  });
});

describe("PATCH /api/todos/:id", () => {
  it("marks a todo as completed", async () => {
    const todo = await Todo.create({ title: "test" });
    const req = new Request(`http://localhost/api/todos/${todo._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: true }),
    });
    const res = await PATCH(req, {
      params: Promise.resolve({ id: String(todo._id) }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.completed).toBe(true);
  });

  it("returns 404 for unknown id", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const req = new Request(`http://localhost/api/todos/${fakeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: true }),
    });
    const res = await PATCH(req, {
      params: Promise.resolve({ id: String(fakeId) }),
    });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/todos/:id", () => {
  it("deletes a todo", async () => {
    const todo = await Todo.create({ title: "test" });
    const req = new Request(`http://localhost/api/todos/${todo._id}`, {
      method: "DELETE",
    });
    const res = await DELETE(req, {
      params: Promise.resolve({ id: String(todo._id) }),
    });
    expect(res.status).toBe(200);
    expect(await Todo.countDocuments()).toBe(0);
  });

  it("returns 404 for unknown id", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const req = new Request(`http://localhost/api/todos/${fakeId}`, {
      method: "DELETE",
    });
    const res = await DELETE(req, {
      params: Promise.resolve({ id: String(fakeId) }),
    });
    expect(res.status).toBe(404);
  });
});
