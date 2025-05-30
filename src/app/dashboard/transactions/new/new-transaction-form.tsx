"use client"
import {z} from 'zod'
import TransactionForm, { transactionFormSchema } from "@/components/common/transaction-form"
import { type Category } from "@/types/Category"
import { createTransaction } from './actions'
import { format } from 'date-fns'

export default function NewTransactionForm({categories}: {categories: Category[]}){

    let handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
        let result = await createTransaction({
            amount: data.amount,
            transactionDate:  format(data.transactionDate, "yyyy-MM-dd"),
            categoryId: data.categoryId,
            description: data.description
        })
    }

    return <TransactionForm onSubmit={handleSubmit} categories={categories}/>
}