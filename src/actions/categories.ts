"use server";

import { db } from "@/lib/db";
import { incomeCategoriesTable, expenseCategoriesTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type CategoryType = "income" | "expense";

export async function createCategory(
  name: string,
  description: string,
  type: CategoryType
) {
  try {
    const table =
      type === "income" ? incomeCategoriesTable : expenseCategoriesTable;
    const [newCategory] = await db
      .insert(table)
      .values({ name, description })
      .returning();
    return { success: true, category: newCategory };
  } catch (error: any) {
    console.error(`Error creating ${type} category:`, error);
    return { success: false, message: error.message };
  }
}

export async function updateCategory(
  id: number,
  name: string,
  description: string,
  type: CategoryType
) {
  try {
    const table =
      type === "income" ? incomeCategoriesTable : expenseCategoriesTable;
    const [updatedCategory] = await db
      .update(table)
      .set({ name, description })
      .where(eq(table.id, id))
      .returning();
    return { success: true, category: updatedCategory };
  } catch (error: any) {
    console.error(`Error updating ${type} category:`, error);
    return { success: false, message: error.message };
  }
}

export async function deleteCategory(id: number, type: CategoryType) {
  try {
    const table =
      type === "income" ? incomeCategoriesTable : expenseCategoriesTable;
    await db.delete(table).where(eq(table.id, id));
    return { success: true };
  } catch (error: any) {
    console.error(`Error deleting ${type} category:`, error);
    return { success: false, message: error.message };
  }
} 