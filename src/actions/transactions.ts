"use server";

import { db } from "@/lib/db";
import { incomeTransactionsTable, expenseTransactionsTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type TransactionType = "income" | "expense";

export async function updateTransaction(
  id: number,
  categoryId: number,
  amount: string,
  description: string,
  transactionDate: string,
  type: TransactionType
) {
  try {
    const table =
      type === "income" ? incomeTransactionsTable : expenseTransactionsTable;

    const [updatedTransaction] = await db
      .update(table)
      .set({ categoryId, amount, description, transactionDate })
      .where(eq(table.id, id))
      .returning();

    return { success: true, transaction: updatedTransaction };
  } catch (error: any) {
    console.error(`Error updating ${type} transaction:`, error);
    return { success: false, message: error.message };
  }
} 