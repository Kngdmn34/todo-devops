import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Todo } from "@/models/Todo";
import { logger } from "@/lib/logger";      

export const dynamic = "force-dynamic";

export async function GET() {
  // (leave as-is for now, we'll do GET later)
  await connectDB();
  const todos = await Todo.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const start = Date.now();              

  await connectDB();
  const body = await req.json();
  const title = typeof body?.title === "string" ? body.title.trim() : "";

  if (!title) {
    // ← LOG #1: warn about validation failure
    logger.warn("todo.create.rejected", { reason: "empty_title" });
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const todo = await Todo.create({ title });

  
  logger.info("todo.created", {
    todoId: todo._id.toString(),
    titleLength: title.length,
    durationMs: Date.now() - start,
  });

  return NextResponse.json(todo, { status: 201 });
}
