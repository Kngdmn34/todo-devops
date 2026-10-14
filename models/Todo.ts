import { Schema, InferSchemaType, models, model } from "mongoose";

const TodoSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type TodoType = InferSchemaType<typeof TodoSchema> & { _id: string };

export const Todo = models.Todo || model("Todo", TodoSchema);
