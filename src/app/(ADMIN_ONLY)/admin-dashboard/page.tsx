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

async function getTableData() {
  const users = await db.query.usersTable.findMany();
  const incomeCategories = await db.query.incomeCategoriesTable.findMany();
  const expenseCategories = await db.query.expenseCategoriesTable.findMany();
  const incomeTransactions = await db.query.incomeTransactionsTable.findMany();
  const expenseTransactions = await db.query.expenseTransactionsTable.findMany();

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

function Table({ data, columns }: { data: any[]; columns: { key: string; label: string }[] }) {
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map((column) => (
                <th key={column.key} className="h-12 px-4 text-left align-middle font-medium">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b transition-colors hover:bg-muted/50">
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
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="income-categories">Income Categories</TabsTrigger>
          <TabsTrigger value="expense-categories">Expense Categories</TabsTrigger>
          <TabsTrigger value="income-transactions">Income Transactions</TabsTrigger>
          <TabsTrigger value="expense-transactions">Expense Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserTable users={data.users} onUpdate={updateUser} />
        </TabsContent>

        <TabsContent value="income-categories">
          <Table
            data={data.incomeCategories}
            columns={[
              { key: "name", label: "Name" },
              { key: "description", label: "Description" },
            ]}
          />
        </TabsContent>

        <TabsContent value="expense-categories">
          <Table
            data={data.expenseCategories}
            columns={[
              { key: "name", label: "Name" },
              { key: "description", label: "Description" },
            ]}
          />
        </TabsContent>

        <TabsContent value="income-transactions">
          <Table
            data={data.incomeTransactions}
            columns={[
              { key: "userId", label: "User" },
              { key: "categoryId", label: "Category" },
              { key: "amount", label: "Amount" },
              { key: "description", label: "Description" },
              { key: "transactionDate", label: "Transaction Date" },
            ]}
          />
        </TabsContent>

        <TabsContent value="expense-transactions">
          <Table
            data={data.expenseTransactions}
            columns={[
              { key: "userId", label: "User" },
              { key: "categoryId", label: "Category" },
              { key: "amount", label: "Amount" },
              { key: "description", label: "Description" },
              { key: "transactionDate", label: "Transaction Date" },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
