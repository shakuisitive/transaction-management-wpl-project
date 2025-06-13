"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { updateTransaction } from "@/actions/transactions";
import { toast } from "sonner";

interface Transaction {
  id: number;
  userId: string;
  categoryId: number;
  amount: string;
  description: string;
  transactionDate: Date | string;
  category?: string; // Optional for display
}

interface Category {
  id: number;
  name: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  categories: Category[];
  type: "income" | "expense";
  onTransactionAction: (action: "update") => void;
}

function TransactionRow({
  transaction,
  categories,
  onUpdate,
}: {
  transaction: Transaction;
  categories: Category[];
  onUpdate: (
    id: number,
    categoryId: number,
    amount: string,
    description: string,
    transactionDate: string
  ) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: transaction.categoryId,
    amount: Number(transaction.amount) || 0,
    description: transaction.description || "",
    transactionDate: typeof transaction.transactionDate === "string"
      ? parseISO(transaction.transactionDate)
      : transaction.transactionDate,
  });

  const handleSave = async () => {
    await onUpdate(
      transaction.id,
      formData.categoryId,
      formData.amount.toString(),
      formData.description,
      format(formData.transactionDate, "yyyy-MM-dd")
    );
    setIsEditing(false);
  };

  const displayCategory = categories.find(cat => cat.id === transaction.categoryId)?.name || 'N/A';

  if (isEditing) {
    return (
      <tr className="border-b transition-colors hover:bg-muted/50">
        <td className="p-4 align-middle">
          <Select
            value={formData.categoryId.toString()}
            onValueChange={(value) =>
              setFormData({ ...formData, categoryId: Number(value) })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </td>
        <td className="p-4 align-middle">
          <Input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: parseFloat(e.target.value) })
            }
            className="w-full"
          />
        </td>
        <td className="p-4 align-middle">
          <Input
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full"
          />
        </td>
        <td className="p-4 align-middle">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !formData.transactionDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.transactionDate ? (
                  format(formData.transactionDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.transactionDate}
                onSelect={(date) =>
                  date && setFormData({ ...formData, transactionDate: date })
                }
                initialFocus
                toDate={new Date()}
              />
            </PopoverContent>
          </Popover>
        </td>
        <td className="p-4 align-middle">
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">
              Save
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
              Cancel
            </Button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b transition-colors hover:bg-muted/50">
      <td className="p-4 align-middle">{displayCategory}</td>
      <td className="p-4 align-middle">{transaction.amount}</td>
      <td className="p-4 align-middle">{transaction.description}</td>
      <td className="p-4 align-middle">{format(typeof transaction.transactionDate === 'string' ? parseISO(transaction.transactionDate) : transaction.transactionDate, "PPP")}</td>
      <td className="p-4 align-middle">
        <Button onClick={() => setIsEditing(true)} size="sm">
          Edit
        </Button>
      </td>
    </tr>
  );
}

export function TransactionTable({
  transactions,
  categories,
  type,
  onTransactionAction,
}: TransactionTableProps) {
  const handleUpdateTransaction = async (
    id: number,
    categoryId: number,
    amount: string,
    description: string,
    transactionDate: string
  ) => {
    const result = await updateTransaction(
      id,
      categoryId,
      amount,
      description,
      transactionDate,
      type
    );
    if (result.success) {
      toast.success("Transaction updated successfully.");
      onTransactionAction("update");
    } else {
      toast.error("Failed to update transaction.", {
        description: result.message,
      });
    }
  };

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium">
                Category
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                Amount
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                Description
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                Transaction Date
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                categories={categories}
                onUpdate={handleUpdateTransaction}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 