import 'server-only';
import { db } from '@/lib/db';
import { incomeCategoriesTable, expenseCategoriesTable, incomeTransactionsTable, expenseTransactionsTable } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { and, eq, sql } from 'drizzle-orm';

export async function getTransactionById(id: number) {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  // Try to find in income transactions
  const incomeTransaction = await db
    .select({
      id: incomeTransactionsTable.id,
      description: incomeTransactionsTable.description,
      amount: incomeTransactionsTable.amount,
      transactionDate: incomeTransactionsTable.transactionDate,
      category: incomeCategoriesTable.name,
      type: sql<'income'>`'income'`,
      categoryId: incomeTransactionsTable.categoryId,
    })
    .from(incomeTransactionsTable)
    .where(
      and(
        eq(incomeTransactionsTable.id, id),
        eq(incomeTransactionsTable.userId, userId)
      )
    )
    .innerJoin(incomeCategoriesTable, eq(incomeTransactionsTable.categoryId, incomeCategoriesTable.id));

  if (incomeTransaction.length > 0) {
    return incomeTransaction[0];
  }

  // Try to find in expense transactions
  const expenseTransaction = await db
    .select({
      id: expenseTransactionsTable.id,
      description: expenseTransactionsTable.description,
      amount: expenseTransactionsTable.amount,
      transactionDate: expenseTransactionsTable.transactionDate,
      category: expenseCategoriesTable.name,
      type: sql<'expense'>`'expense'`,
      categoryId: expenseTransactionsTable.categoryId,
    })
    .from(expenseTransactionsTable)
    .where(
      and(
        eq(expenseTransactionsTable.id, id),
        eq(expenseTransactionsTable.userId, userId)
      )
    )
    .innerJoin(expenseCategoriesTable, eq(expenseTransactionsTable.categoryId, expenseCategoriesTable.id));

  if (expenseTransaction.length > 0) {
    return expenseTransaction[0];
  }

  return null;
} 