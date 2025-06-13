import "server-only";
import { incomeCategoriesTable, expenseCategoriesTable } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { type Category } from "@/types/Category";

export async function getCategories(): Promise<{
  income: Category[];
  expense: Category[];
}> {
  const [incomeCategories, expenseCategories] = await Promise.all([
    db.select().from(incomeCategoriesTable),
    db.select().from(expenseCategoriesTable)
  ]);

  return {
    income: incomeCategories as Category[],
    expense: expenseCategories as Category[]
  };
}
