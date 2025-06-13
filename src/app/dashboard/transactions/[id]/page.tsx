import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTransactionById } from "@/data/getTransactionById";
import { getCategories } from "@/data/getCategories";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import numeral from "numeral";
import DeleteTransactionButton from "./delete-transaction-button";
import EditTransactionForm from "./edit-transaction-form";

export default async function TransactionViewPage({
  params,
}: {
  params: { id: string };
}) {
  const transaction = await getTransactionById(parseInt(params.id));
  const categories = await getCategories();

  if (!transaction) {
    notFound();
  }

  // Fix types for form
  const { category, ...transactionForForm } = {
    ...transaction,
    amount: Number(transaction.amount),
    transactionDate: new Date(transaction.transactionDate),
  };

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
            <BreadcrumbLink asChild>
              <Link href="/dashboard/transactions">Transactions</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Edit Transaction</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-4 max-w-screen-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Edit Transaction</CardTitle>
          <DeleteTransactionButton id={transaction.id} type={transaction.type} />
        </CardHeader>
        <CardContent>
          <EditTransactionForm transaction={transactionForForm} categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
