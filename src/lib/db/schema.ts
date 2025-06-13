import {
  pgTable,
  text,
  integer,
  numeric,
  date,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

// Users table (using Clerk's user data)
export const usersTable = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user ID
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Income Categories table - fixed categories
export const incomeCategoriesTable = pgTable("income_categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull().unique(), // Ensure category names are unique
  description: text("description"), // Brief description of the category
  status: boolean("is_active").default(true).notNull(), // To disable categories without deleting
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Expense Categories table - fixed categories
export const expenseCategoriesTable = pgTable("expense_categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull().unique(), // Ensure category names are unique
  description: text("description"), // Brief description of the category
  status: boolean("is_active").default(true).notNull(), // To disable categories without deleting
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Income Transactions table
export const incomeTransactionsTable = pgTable("income_transactions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id")
    .references(() => usersTable.id)
    .notNull(),
  categoryId: integer("category_id")
    .references(() => incomeCategoriesTable.id)
    .notNull(),
  amount: numeric("amount").notNull(),
  description: text("description").notNull(),
  transactionDate: date("transaction_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Expense Transactions table
export const expenseTransactionsTable = pgTable("expense_transactions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id")
    .references(() => usersTable.id)
    .notNull(),
  categoryId: integer("category_id")
    .references(() => expenseCategoriesTable.id)
    .notNull(),
  amount: numeric("amount").notNull(),
  description: text("description").notNull(),
  transactionDate: date("transaction_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
