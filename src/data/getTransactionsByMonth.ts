import 'server-only';
import { db } from '@/lib/db';
import { transactionsTable } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { and, desc, eq, gte, lte } from 'drizzle-orm';
import { format } from 'date-fns';

export async function getTransactionsByMonth({
    month, year
}: {
    month: number,
    year: number,
}){
    let {userId} = await auth();

    if(!userId) {return null};

    let earliestDate = new Date(year, month - 1, 1);
    let latestDate  = new Date(year, month, 0)

    let transactions = await db.select().from(transactionsTable).where(and(
        eq(transactionsTable.userId, userId),
        gte(transactionsTable.transactionDate, format(earliestDate, "yyyy-MM-dd")),
        lte(transactionsTable.transactionDate, format(latestDate, "yyyy-MM-dd"))
        ),
    ).orderBy(desc(transactionsTable.transactionDate))

    return transactions;

}
