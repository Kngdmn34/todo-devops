import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
    env: {
      MONGODB_URI:
        process.env.MONGODB_URI ??
        "mongodb://localhost:27017/todo-devops-test",
    },
    hookTimeout: 30000,
    testTimeout: 15000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
