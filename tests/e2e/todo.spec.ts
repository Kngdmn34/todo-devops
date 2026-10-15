import { test, expect } from "@playwright/test";

test.beforeEach(async ({ request }) => {
  // Clean the test DB before each test
  const res = await request.get("/api/todos");
  const todos: Array<{ _id: string }> = await res.json();
  for (const t of todos) {
    await request.delete(`/api/todos/${t._id}`);
  }
});

test("add → toggle → delete a todo", async ({ page }) => {
  await page.goto("/");

  // Add
  await page.getByPlaceholder("What needs doing?").fill("buy milk");
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.getByText("buy milk")).toBeVisible();
  await expect(page.getByText("1 of 1 remaining")).toBeVisible();

  // Toggle complete
  await page.getByRole("button", { name: "Mark as complete" }).click();
  await expect(page.getByText("0 of 1 remaining")).toBeVisible();

  // Delete
  await page.getByRole("button", { name: "Delete todo" }).click();
  await expect(page.getByText("buy milk")).not.toBeVisible();
  await expect(
    page.getByText("Nothing here yet. Add your first task.")
  ).toBeVisible();
});
