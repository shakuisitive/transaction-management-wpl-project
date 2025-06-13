import { drizzle } from "drizzle-orm/neon-http";
import { incomeCategoriesTable, expenseCategoriesTable } from "./lib/db/schema";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
export const db = drizzle(process.env.DATABASE_URL!);

const incomeCategories = [
  {
    name: "Salary",
    description: "Regular employment income",
    status: true,
  },
  {
    name: "Rental Income",
    description: "Income from property rentals",
    status: true,
  },
  {
    name: "Business Income",
    description: "Income from business activities",
    status: true,
  },
  {
    name: "Investments",
    description: "Income from investments and dividends",
    status: true,
  },
  {
    name: "Other Income",
    description: "Miscellaneous income sources",
    status: true,
  },
];

const expenseCategories = [
  {
    name: "Housing",
    description: "Rent, mortgage, and housing-related expenses",
    status: true,
  },
  {
    name: "Transport",
    description: "Transportation and vehicle expenses",
    status: true,
  },
  {
    name: "Food & Groceries",
    description: "Food, groceries, and dining expenses",
    status: true,
  },
  {
    name: "Health",
    description: "Healthcare and medical expenses",
    status: true,
  },
  {
    name: "Entertainment & Leisure",
    description: "Entertainment and recreational expenses",
    status: true,
  },
  {
    name: "Other Expenses",
    description: "Miscellaneous expenses",
    status: true,
  },
];

async function seedCategories() {
  try {
    await db.insert(incomeCategoriesTable).values(incomeCategories);
    console.log("Income categories seeded successfully!");

    await db.insert(expenseCategoriesTable).values(expenseCategories);
    console.log("Expense categories seeded successfully!");
  } catch (error: any) {
    if (error.code === "23505") {
      console.log("Categories already exist, skipping seed.");
    } else {
      throw error;
    }
  }
}

seedCategories().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
