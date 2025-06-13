import "server-only";
import { incomeCategoriesTable, expenseCategoriesTable } from "@/lib/db/schema";
import { db } from "@/lib/db";

export async function getCategories() {
  const [incomeCategories, expenseCategories] = await Promise.all([
    db.select().from(incomeCategoriesTable),
    db.select().from(expenseCategoriesTable)
  ]);

  return {
    income: incomeCategories,
    expense: expenseCategories
  };
}
