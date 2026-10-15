import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Todo } from "@/models/Todo";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const todos = await Todo.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  if (!body?.title || typeof body.title !== "string") {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  const todo = await Todo.create({ title: body.title.trim() });
  return NextResponse.json(todo, { status: 201 });
}
