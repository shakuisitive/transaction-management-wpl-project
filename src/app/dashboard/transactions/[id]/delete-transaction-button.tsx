"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteTransaction } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function DeleteTransactionButton({
  id,
  type,
}: {
  id: number;
  type: "income" | "expense";
}) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const result = await deleteTransaction(id, type);

      if (result.error) {
        toast.error("Failed to delete transaction", {
          description: result.message,
        });
        return;
      }

      toast.success("Transaction deleted successfully");
      router.push("/dashboard/transactions");
    } catch (error) {
      toast.error("An error occurred", {
        description: "Failed to delete transaction. Please try again.",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            transaction.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 