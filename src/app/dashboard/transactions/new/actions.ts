"use server";
import { db } from "@/lib/db";
import { incomeTransactionsTable, expenseTransactionsTable, usersTable } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { addDays, subYears } from "date-fns";
import { z } from "zod";
import { eq } from "drizzle-orm";

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

export let createTransaction = async (data: {
  amount: number;
  transactionDate: string;
  description: string;
  categoryId: number;
  transactionType: "income" | "expense";
}) => {
  let { userId } = await auth();

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
    // First, ensure the user exists in our database
    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!existingUser) {
      // If user doesn't exist, create them
      await db.insert(usersTable).values({
        id: userId,
        email: "", // We'll update this later if needed
        firstName: "",
        lastName: "",
      });
    }

    const table = data.transactionType === "income" ? incomeTransactionsTable : expenseTransactionsTable;
    
    let [transaction] = await db
      .insert(table)
      .values({
        userId,
        amount: data.amount.toString(),
        description: data.description,
        categoryId: data.categoryId,
        transactionDate: data.transactionDate,
      })
      .returning();

    return { id: transaction.id, message: "Success" };
  } catch (e: any) {
    console.error("Transaction creation error:", e);
    return {
      error: true,
      message: e.message,
    };
  }
};
