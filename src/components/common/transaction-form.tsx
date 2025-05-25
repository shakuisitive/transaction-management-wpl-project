"use client";
import { z } from "zod";
import { addDays, format } from "date-fns";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { type Category } from "@/types/Category";

let transactionFormSchema = z.object({
  transactionType: z.enum(["income", "expense"]),
  categoryId: z.coerce.number().positive("Please select a category"),
  transactionDate: z.coerce
    .date()
    .max(addDays(new Date(), 1), "Transaction date cannot be in the future."),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  description: z
    .string()
    .min(3, "The description must contain at least 3 characters.")
    .max(300, "The description must contain a maximum of 300 characters."),
});

const TransactionForm = ({ categories }: { categories: Category[] }) => {
  let form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      amount: 0,
      categoryId: 0,
      description: "",
      transactionDate: new Date(),
      transactionType: "income",
    },
  });

  const transactionType = useWatch({
    control: form.control,
    name: "transactionType",
  });

  let filteredCategories = categories.filter(
    (category) => category.type === transactionType
  );

  let handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <fieldset className="grid grid-cols-2 gap-y-5 gap-x-2 ">
          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transaction Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(newValue) => {
                      field.onChange(newValue);
                      form.setValue("categoryId", 0);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            control={form.control}
            name="transactionType"
          />

          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value.toString()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCategories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            control={form.control}
            name="categoryId"
          />

          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transaction Date</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={{ after: new Date() }}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            control={form.control}
            name="transactionDate"
          />

          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            control={form.control}
            name="amount"
          />
        </fieldset>

        <fieldset className="mt-5 flex flex-col gap-5">
          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            control={form.control}
            name="description"
          />
          <Button type="submit">Submit</Button>
        </fieldset>
      </form>
    </Form>
  );
};

export default TransactionForm;
