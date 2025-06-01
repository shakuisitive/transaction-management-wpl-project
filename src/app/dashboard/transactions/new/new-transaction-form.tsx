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
  categories: Category[];
}) {
  let router = useRouter();

  let handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    let result = await createTransaction({
      amount: data.amount,
      transactionDate: format(data.transactionDate, "yyyy-MM-dd"),
      categoryId: data.categoryId,
      description: data.description,
    });

    if (result.error) {
      toast("Failed to insert the data.", {
        description: result.message,
        style: {
          backgroundColor: "#f03e3e", // red-500
          color: "white",
        },
        action: {
          label: "Understood",
          onClick: () => console.log("Undo"),
        },
      });

      return;
    }

    toast(result.message, {
      style: {
        backgroundColor: "#37b24d", // red-500
        color: "white",
      },
      action: {
        label: "Understood",
        onClick: () => console.log("Undo"),
      },
    });

    router.push(`/dashboard/transactions/?month=${data.transactionDate.getMonth() + 1}&year=${data.transactionDate.getFullYear()}`);
  };

  return <TransactionForm onSubmit={handleSubmit} categories={categories} />;
}
