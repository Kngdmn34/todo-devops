import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbStatus: "connected" | "disconnected" = "disconnected";

  try {
    await connectDB();
    await mongoose.connection.db?.admin().ping();
    dbStatus = "connected";
  } catch (err) {
    console.error("health check failed:", err);
  }

  const healthy = dbStatus === "connected";

  return NextResponse.json(
    {
      status: healthy ? "ok" : "error",
      db: dbStatus,
      version: process.env.npm_package_version ?? "unknown",
      timestamp: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 }
  );
}
