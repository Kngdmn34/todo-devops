import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    testTimeout: 15_000,
    hookTimeout: 15_000,
    // Test files share the same MongoDB — running them in parallel
    // causes them to wipe each other's fixtures. Serialize.
    fileParallelism: false,
include:["tests/unit/**/*.test.ts"],
    env: {
      MONGODB_URI:
        process.env.MONGODB_URI ?? "mongodb://localhost:27017/todo-devops-test",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
