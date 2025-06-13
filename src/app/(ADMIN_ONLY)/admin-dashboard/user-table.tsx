"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

interface UserTableProps {
  users: User[];
  onUpdate: (data: any) => Promise<void>;
}

function UserRow({ user, onUpdate }: { user: User; onUpdate: (data: any) => Promise<void> }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    role: user.role,
  });

  const handleSave = async () => {
    await onUpdate({
      id: user.id,
      ...formData,
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <tr className="border-b transition-colors hover:bg-muted/50">
        <td className="p-4 align-middle">{user.email}</td>
        <td className="p-4 align-middle">
          <Input
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full"
          />
        </td>
        <td className="p-4 align-middle">
          <Input
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full"
          />
        </td>
        <td className="p-4 align-middle">
          <Select
            value={formData.role}
            onValueChange={(value) => setFormData({ ...formData, role: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
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
      <td className="p-4 align-middle">{user.email}</td>
      <td className="p-4 align-middle">{user.firstName || "-"}</td>
      <td className="p-4 align-middle">{user.lastName || "-"}</td>
      <td className="p-4 align-middle">{user.role}</td>
      <td className="p-4 align-middle">
        <Button onClick={() => setIsEditing(true)} size="sm">
          Edit
        </Button>
      </td>
    </tr>
  );
}

export function UserTable({ users, onUpdate }: UserTableProps) {
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
              <th className="h-12 px-4 text-left align-middle font-medium">First Name</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Last Name</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Role</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow key={user.id} user={user} onUpdate={onUpdate} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 