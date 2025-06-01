import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTransactionsByMonth } from "@/data/getTransactionsByMonth";
import { format } from "date-fns";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import numeral from 'numeral'

import {z} from 'zod';
let today = new Date();

let searchSchema = z.object({
  year: z.coerce.number().min(today.getFullYear() - 100).max(today.getFullYear() + 1).catch(today.getFullYear()),
  // this is original: month: z.coerce.number().min(1).max(12).catch(today.getMonth() + 1)
  // experimenting with below rn: changed .catch value to 1 so if there's an invalid
  // month number, default of 1 will be used.
  month: z.coerce.number().min(1).max(12).catch(1)
})

async function TransactionsPage({searchParams}: {
  searchParams: Promise<{year?: string, month?: string}>
}) {
  let searchParamsValues = await searchParams;

  let {year, month} = searchSchema.parse(searchParamsValues);

  let selectedDate = new Date(year, month - 1, 1);

  let transactions = await getTransactionsByMonth({month, year});

  return (
    <div className="max-w-screen-xl mx-auto py-10">
        <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
          <BreadcrumbPage>Transactions</BreadcrumbPage>
            
          </BreadcrumbItem>
          <BreadcrumbSeparator />
         
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>{format(selectedDate, "MMM yyyy")}</span>
            <div>dropdowns</div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Button asChild>
            <Link href="/dashboard/transactions/new">New Transaction</Link>
          </Button>

          {!transactions?.length && <p className="text-center py-10 text-lg text-muted-foreground">There is no transaction for this month.</p>}
        
          {!!transactions?.length && <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead/>
              </TableRow>
            </TableHeader>

            <TableBody>
              {transactions.map(transaction => (<TableRow key={transaction.id}>
                  <TableCell>{format(transaction.transactionDate, 'do MM yyyy')}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.categoryId}</TableCell>
                  <TableCell>{transaction.categoryId}</TableCell>
                  <TableCell>${numeral(transaction.amount).format('0,0[.]00')}</TableCell>
                  <TableCell className="text-right"><Button aria-label="Edit transaction" asChild size="icon" variant="outline"><Link href={`/dashboard/transactions/${transaction.id}`}><PencilIcon/></Link></Button></TableCell>
                </TableRow>))}
            </TableBody>
            </Table>}
        </CardContent>
      </Card>
    </div>
  )
}

export default TransactionsPage