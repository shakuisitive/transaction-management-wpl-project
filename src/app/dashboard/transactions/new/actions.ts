"use server";
import { db } from "@/lib/db";
import { transactionsTable } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { addDays, subYears } from "date-fns";
import { z } from "zod";

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
});

export let createTransaction = async (data: {
  amount: number;
  transactionDate: string;
  description: string;
  categoryId: number;
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
    let [transaction] = await db
      .insert(transactionsTable)
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
    return {
      error: true,
      message: e.message,
    };
  }
};
