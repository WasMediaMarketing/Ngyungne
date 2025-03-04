"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { AddUserDialog } from "./add-user-dialog";
import { EditUserDialog } from "./edit-user-dialog";
import { ViewUserDialog } from "./view-user-dialog";
import { DeleteUserAlert } from "./delete-user-alert";
import type { IUser } from "@/types/user.types";
import { toast } from "@/components/ui/use-toast";
import { DataTable } from "@/components/ui/data-table";

interface UserTableProps {
  users: IUser[];
  onUserAdded: (user: IUser) => void;
  onUserUpdated: (user: IUser) => void;
  onUserDeleted: (userId: string) => void;
  refreshUsers: () => Promise<void>;
}

export function UserTable({
  users,
  onUserAdded,
  onUserUpdated,
  onUserDeleted,
  refreshUsers,
}: UserTableProps) {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isViewUserOpen, setIsViewUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const handleAddUser = (newUser: IUser) => {
    console.log("UserTable - handleAddUser called with:", newUser);
    onUserAdded(newUser);
    toast({
      title: "Success",
      description: "User has been added successfully.",
    });
  };

  const handleUpdateUser = (updatedUser: IUser) => {
    console.log("UserTable - handleUpdateUser called with:", updatedUser);
    onUserUpdated(updatedUser);
    toast({
      title: "Success",
      description: "User has been updated successfully.",
    });
  };

  const handleDeleteUser = (userId: string) => {
    console.log("UserTable - handleDeleteUser called with:", userId);
    onUserDeleted(userId);
    toast({
      title: "Success",
      description: "User has been deleted successfully.",
    });
  };

  const columns: ColumnDef<IUser>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
      cell: ({ row }) => row.original.phoneNumber || "N/A",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role;
        let color = "";

        switch (role) {
          case "admin":
            color = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
            break;
          case "volunteer":
            color =
              "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
            break;
          case "donator":
            color =
              "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
            break;
          default:
            color =
              "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
        }

        return (
          <Badge className={color}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user);
                  setIsViewUserOpen(true);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user);
                  setIsEditUserOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user);
                  setIsDeleteUserOpen(true);
                }}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Users</h2>
        <Button
          onClick={() => {
            console.log("Add User button clicked");
            setIsAddUserOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      {users.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-gray-500">
            No users found. Add a user to get started.
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          filterColumn="name"
          filterPlaceholder="Filter by name..."
        />
      )}

      {isAddUserOpen && (
        <AddUserDialog
          open={isAddUserOpen}
          onOpenChange={setIsAddUserOpen}
          onUserAdded={handleAddUser}
          refreshUsers={refreshUsers}
        />
      )}

      {selectedUser && isViewUserOpen && (
        <ViewUserDialog
          open={isViewUserOpen}
          onOpenChange={setIsViewUserOpen}
          user={selectedUser}
        />
      )}

      {selectedUser && isEditUserOpen && (
        <EditUserDialog
          open={isEditUserOpen}
          onOpenChange={setIsEditUserOpen}
          user={selectedUser}
          onUserUpdated={handleUpdateUser}
          refreshUsers={refreshUsers}
        />
      )}

      {selectedUser && isDeleteUserOpen && (
        <DeleteUserAlert
          open={isDeleteUserOpen}
          onOpenChange={setIsDeleteUserOpen}
          user={selectedUser}
          onUserDeleted={handleDeleteUser}
          refreshUsers={refreshUsers}
        />
      )}
    </div>
  );
}
