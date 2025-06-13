"use server";
import { db } from "@/lib/db";
import { incomeTransactionsTable, expenseTransactionsTable } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { addDays, subYears } from "date-fns";

let transactionSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  description: z
    .string()
    .min(3, "The description must contain at least 3 characters.")
    .max(300, "The description must contain a maximum of 300 characters."),
  categoryId: z.number().positive("Please select a category"),
  transactionDate: z.coerce
    .date()
    .min(subYears(new Date(), 100))
    .max(addDays(new Date(), 1)),
  transactionType: z.enum(["income", "expense"])
});

export async function deleteTransaction(id: number, type: 'income' | 'expense') {
  const { userId } = await auth();

  if (!userId) {
    return {
      error: true,
      message: "User is not authenticated",
    };
  }

  try {
    const table = type === 'income' ? incomeTransactionsTable : expenseTransactionsTable;
    
    await db
      .delete(table)
      .where(
        and(
          eq(table.id, id),
          eq(table.userId, userId)
        )
      );

    return { success: true };
  } catch (error: any) {
    console.error("Transaction deletion error:", error);
    return {
      error: true,
      message: error.message,
    };
  }
}

export async function updateTransaction(id: number, data: {
  amount: number;
  transactionDate: string;
  description: string;
  categoryId: number;
  transactionType: "income" | "expense";
}) {
  const { userId } = await auth();

  if (!userId) {
    return {
      error: true,
      message: "User is not authenticated",
    };
  }

  let validation = transactionSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0].message,
    };
  }

  try {
    // First check if the transaction exists and belongs to the user
    const incomeTransaction = await db
      .select()
      .from(incomeTransactionsTable)
      .where(
        and(
          eq(incomeTransactionsTable.id, id),
          eq(incomeTransactionsTable.userId, userId)
        )
      );

    const expenseTransaction = await db
      .select()
      .from(expenseTransactionsTable)
      .where(
        and(
          eq(expenseTransactionsTable.id, id),
          eq(expenseTransactionsTable.userId, userId)
        )
      );

    if (incomeTransaction.length === 0 && expenseTransaction.length === 0) {
      return {
        error: true,
        message: "Transaction not found",
      };
    }

    const currentType = incomeTransaction.length > 0 ? "income" : "expense";
    const table = data.transactionType === "income" ? incomeTransactionsTable : expenseTransactionsTable;

    // If the type has changed, we need to delete from the old table and insert into the new one
    if (currentType !== data.transactionType) {
      const oldTable = currentType === "income" ? incomeTransactionsTable : expenseTransactionsTable;
      
      // Delete from old table
      await db
        .delete(oldTable)
        .where(
          and(
            eq(oldTable.id, id),
            eq(oldTable.userId, userId)
          )
        );

      // Insert into new table
      const [newTransaction] = await db
        .insert(table)
        .values({
          userId,
          amount: data.amount.toString(),
          description: data.description,
          categoryId: data.categoryId,
          transactionDate: data.transactionDate,
        })
        .returning();

      return { id: newTransaction.id, message: "Success" };
    }

    // If type hasn't changed, just update the existing record
    const [updatedTransaction] = await db
      .update(table)
      .set({
        amount: data.amount.toString(),
        description: data.description,
        categoryId: data.categoryId,
        transactionDate: data.transactionDate,
      })
      .where(
        and(
          eq(table.id, id),
          eq(table.userId, userId)
        )
      )
      .returning();

    return { id: updatedTransaction.id, message: "Success" };
  } catch (error: any) {
    console.error("Transaction update error:", error);
    return {
      error: true,
      message: error.message,
    };
  }
} 