"use client";

import { z } from "zod";
import TransactionForm, {
  transactionFormSchema,
} from "@/components/common/transaction-form";
import { type Category } from "@/types/Category";
import { updateTransaction } from "./actions";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Transaction = {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  transactionDate: Date;
  categoryId: number;
};

export default function EditTransactionForm({
  transaction,
  categories,
}: {
  transaction: Transaction;
  categories: {
    income: Category[];
    expense: Category[];
  };
}) {
  const router = useRouter();

  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    try {
      const result = await updateTransaction(transaction.id, {
        amount: data.amount,
        transactionDate: format(data.transactionDate, "yyyy-MM-dd"),
        categoryId: data.categoryId,
        description: data.description,
        transactionType: data.transactionType,
      });

      if (result.error) {
        toast.error("Failed to update transaction", {
          description: result.message,
        });
        return;
      }

      toast.success("Transaction updated successfully", {
        description: "Your transaction has been updated.",
      });

      router.push(`/dashboard/transactions/?month=${data.transactionDate.getMonth() + 1}&year=${data.transactionDate.getFullYear()}`);
    } catch (error) {
      toast.error("An error occurred", {
        description: "Failed to update transaction. Please try again.",
      });
    }
  };

  return (
    <TransactionForm 
      onSubmit={handleSubmit} 
      categories={categories}
      defaultValues={{
        amount: transaction.amount,
        categoryId: transaction.categoryId,
        description: transaction.description,
        transactionDate: new Date(transaction.transactionDate),
        transactionType: transaction.type,
      }}
    />
  );
} 