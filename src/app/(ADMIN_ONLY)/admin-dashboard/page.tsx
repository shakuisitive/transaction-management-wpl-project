import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/db";
import {
  usersTable,
  incomeCategoriesTable,
  expenseCategoriesTable,
  incomeTransactionsTable,
  expenseTransactionsTable,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { UserTable } from "./user-table";
import { CategoryTable } from "./category-table";
import { TransactionTable } from "./transaction-table";
import { revalidatePath } from "next/cache";

async function getTableData() {
  const users = await db.query.usersTable.findMany();
  const incomeCategories = await db.query.incomeCategoriesTable.findMany();
  const expenseCategories = await db.query.expenseCategoriesTable.findMany();
  const incomeTransactions = await db.query.incomeTransactionsTable.findMany();
  const expenseTransactions =
    await db.query.expenseTransactionsTable.findMany();

  return {
    users,
    incomeCategories,
    expenseCategories,
    incomeTransactions,
    expenseTransactions,
  };
}

function formatValue(value: any): string {
  if (value instanceof Date) {
    return value.toLocaleString();
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (value === null || value === undefined) {
    return "-";
  }
  return String(value);
}

function Table({
  data,
  columns,
}: {
  data: any[];
  columns: { key: string; label: string }[];
}) {
  return (
    <div className="rounded-md border max-w-screen-xl mx-auto py-10">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="h-12 px-4 text-left align-middle font-medium"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                className="border-b transition-colors hover:bg-muted/50"
              >
                {columns.map((column) => (
                  <td key={column.key} className="p-4 align-middle">
                    {formatValue(row[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function AdminDashboard() {
  const data = await getTableData();

  async function updateUser(userData: any) {
    "use server";
    await db
      .update(usersTable)
      .set({
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
      })
      .where(eq(usersTable.id, userData.id));
    revalidatePath("/admin-dashboard"); // Revalidate after user update
  }

  async function revalidateAdminDashboardData() {
    "use server";
    revalidatePath("/admin-dashboard"); // Revalidate after category and transaction actions
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="income-categories">Income Categories</TabsTrigger>
          <TabsTrigger value="expense-categories">
            Expense Categories
          </TabsTrigger>
          <TabsTrigger value="income-transactions">
            Income Transactions
          </TabsTrigger>
          <TabsTrigger value="expense-transactions">
            Expense Transactions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserTable users={data.users} onUpdate={updateUser} />
        </TabsContent>

        <TabsContent value="income-categories">
          <CategoryTable
            categories={data.incomeCategories}
            type="income"
            onCategoryAction={revalidateAdminDashboardData}
          />
        </TabsContent>

        <TabsContent value="expense-categories">
          <CategoryTable
            categories={data.expenseCategories}
            type="expense"
            onCategoryAction={revalidateAdminDashboardData}
          />
        </TabsContent>

        <TabsContent value="income-transactions">
          <TransactionTable
            transactions={data.incomeTransactions}
            categories={data.incomeCategories}
            type="income"
            onTransactionAction={revalidateAdminDashboardData}
          />
        </TabsContent>

        <TabsContent value="expense-transactions">
          <TransactionTable
            transactions={data.expenseTransactions}
            categories={data.expenseCategories}
            type="expense"
            onTransactionAction={revalidateAdminDashboardData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
