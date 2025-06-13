"use client";
import { z } from "zod";
import TransactionForm, {
  transactionFormSchema,
} from "@/components/common/transaction-form";
import { type Category } from "@/types/Category";
import { createTransaction } from "./actions";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function NewTransactionForm({
  categories,
}: {
  categories: {
    income: Category[];
    expense: Category[];
  };
}) {
  let router = useRouter();

  let handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    try {
      let result = await createTransaction({
        amount: data.amount,
        transactionDate: format(data.transactionDate, "yyyy-MM-dd"),
        categoryId: data.categoryId,
        description: data.description,
        transactionType: data.transactionType,
      });

      if (result.error) {
        toast.error("Failed to create transaction", {
          description: result.message,
        });
        return;
      }

      toast.success("Transaction created successfully", {
        description: "Your transaction has been recorded.",
      });

      router.push(`/dashboard/transactions/?month=${data.transactionDate.getMonth() + 1}&year=${data.transactionDate.getFullYear()}`);
    } catch (error) {
      toast.error("An error occurred", {
        description: "Failed to create transaction. Please try again.",
      });
    }
  };

  return <TransactionForm onSubmit={handleSubmit} categories={categories} />;
}
