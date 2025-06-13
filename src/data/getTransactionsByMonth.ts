import "server-only";
import { db } from "@/lib/db";
import {
  incomeCategoriesTable,
  expenseCategoriesTable,
  incomeTransactionsTable,
  expenseTransactionsTable,
} from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { format } from "date-fns";

type TransactionType = "income" | "expense";

interface Transaction {
  id: number;
  description: string;
  amount: string;
  transactionDate: Date;
  category: string;
  type: TransactionType;
}

export async function getTransactionsByMonth({
  month,
  year,
}: {
  month: number;
  year: number;
}): Promise<Transaction[] | null> {
  let { userId } = await auth();

  if (!userId) {
    return null;
  }

  let earliestDate = new Date(year, month - 1, 1);
  let latestDate = new Date(year, month, 0);

  // Get income transactions with category names
  const incomeTransactions = await db
    .select({
      id: incomeTransactionsTable.id,
      description: incomeTransactionsTable.description,
      amount: incomeTransactionsTable.amount,
      transactionDate: incomeTransactionsTable.transactionDate,
      category: incomeCategoriesTable.name,
      type: sql<"income">`'income'`,
    })
    .from(incomeTransactionsTable)
    .where(
      and(
        eq(incomeTransactionsTable.userId, userId),
        gte(
          incomeTransactionsTable.transactionDate,
          format(earliestDate, "yyyy-MM-dd")
        ),
        lte(
          incomeTransactionsTable.transactionDate,
          format(latestDate, "yyyy-MM-dd")
        )
      )
    )
    .innerJoin(
      incomeCategoriesTable,
      eq(incomeTransactionsTable.categoryId, incomeCategoriesTable.id)
    );

  // Get expense transactions with category names
  const expenseTransactions = await db
    .select({
      id: expenseTransactionsTable.id,
      description: expenseTransactionsTable.description,
      amount: expenseTransactionsTable.amount,
      transactionDate: expenseTransactionsTable.transactionDate,
      category: expenseCategoriesTable.name,
      type: sql<"expense">`'expense'`,
    })
    .from(expenseTransactionsTable)
    .where(
      and(
        eq(expenseTransactionsTable.userId, userId),
        gte(
          expenseTransactionsTable.transactionDate,
          format(earliestDate, "yyyy-MM-dd")
        ),
        lte(
          expenseTransactionsTable.transactionDate,
          format(latestDate, "yyyy-MM-dd")
        )
      )
    )
    .innerJoin(
      expenseCategoriesTable,
      eq(expenseTransactionsTable.categoryId, expenseCategoriesTable.id)
    );

  // Combine and sort all transactions
  const allTransactions = [...incomeTransactions, ...expenseTransactions]
    .map((transaction) => ({
      ...transaction,
      transactionDate: new Date(transaction.transactionDate as string),
    }))
    .sort((a, b) => b.transactionDate.getTime() - a.transactionDate.getTime());

  return allTransactions as Transaction[];
}
