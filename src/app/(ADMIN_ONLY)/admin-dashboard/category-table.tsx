"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/actions/categories";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
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

interface Category {
  id: number;
  name: string;
  description: string | null;
}

interface CategoryTableProps {
  categories: Category[];
  type: "income" | "expense";
  onCategoryAction: (action: "create" | "update" | "delete") => void;
}

function CategoryRow({
  category,
  onUpdate,
  onDelete,
}: {
  category: Category;
  onUpdate: (id: number, name: string, description: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: category.name || "",
    description: category.description || "",
  });

  const handleSave = async () => {
    await onUpdate(category.id, formData.name, formData.description || "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <tr className="border-b transition-colors hover:bg-muted/50">
        <td className="p-4 align-middle">
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full"
          />
        </td>
        <td className="p-4 align-middle">
          <Input
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full"
          />
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
      <td className="p-4 align-middle">{category.name}</td>
      <td className="p-4 align-middle">{category.description || "-"}</td>
      <td className="p-4 align-middle">
        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(true)} size="sm">
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  the category and remove its data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(category.id)}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </td>
    </tr>
  );
}

export function CategoryTable({ categories, type, onCategoryAction }: CategoryTableProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");

  const handleCreateCategory = async () => {
    if (!newCategoryName) {
      toast.error("Category name cannot be empty.");
      return;
    }
    const result = await createCategory(newCategoryName, newCategoryDescription, type);
    if (result.success) {
      toast.success("Category created successfully.");
      setNewCategoryName("");
      setNewCategoryDescription("");
      onCategoryAction("create");
    } else {
      toast.error("Failed to create category.", {
        description: result.message,
      });
    }
  };

  const handleUpdateCategory = async (
    id: number,
    name: string,
    description: string
  ) => {
    const result = await updateCategory(id, name, description, type);
    if (result.success) {
      toast.success("Category updated successfully.");
      onCategoryAction("update");
    } else {
      toast.error("Failed to update category.", {
        description: result.message,
      });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    const result = await deleteCategory(id, type);
    if (result.success) {
      toast.success("Category deleted successfully.");
      onCategoryAction("delete");
    } else {
      toast.error("Failed to delete category.", {
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
                Name
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                Description
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                onUpdate={handleUpdateCategory}
                onDelete={handleDeleteCategory}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Add New Category</h3>
        <Input
          placeholder="Category Name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <Input
          placeholder="Category Description (Optional)"
          value={newCategoryDescription}
          onChange={(e) => setNewCategoryDescription(e.target.value)}
        />
        <Button onClick={handleCreateCategory} className="w-full">
          Add Category
        </Button>
      </div>
    </div>
  );
} 