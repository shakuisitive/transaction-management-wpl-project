import "server-only";
import { categoriesTable } from "@/lib/db/schema";
import { db } from "@/lib/db";
export async function getCategories() {
  let categories = await db.select().from(categoriesTable);

  return categories;
}
