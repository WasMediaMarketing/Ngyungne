"use client";

import { useState, useCallback } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Filter,
} from "lucide-react";
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
import { DeleteMultipleUsersAlert } from "./delete-multiple-users-alert";
import type { IUser } from "@/types/user.types";
import { toast } from "@/components/ui/use-toast-hook";
import { DataTable } from "@/components/ui/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
  const [isDeleteMultipleUsersOpen, setIsDeleteMultipleUsersOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [nameFilter, setNameFilter] = useState("");
  const [pageFilter, setPageFilter] = useState("");
  const [pageTitleFilter, setPageTitleFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const handleAddUser = (newUser: IUser) => {
    onUserAdded(newUser);
    toast({
      title: "Success",
      description: "User has been added successfully.",
    });
  };

  const handleUpdateUser = (updatedUser: IUser) => {
    onUserUpdated(updatedUser);
    toast({
      title: "Success",
      description: "User has been updated successfully.",
    });
  };

  const handleDeleteUser = (userId: string) => {
    onUserDeleted(userId);
    toast({
      title: "Success",
      description: "User has been deleted successfully.",
    });
  };

  const handleDeleteMultipleUsers = (userIds: string[]) => {
    userIds.forEach((id) => onUserDeleted(id));
    setSelectedRows([]);
    toast({
      title: "Success",
      description: `${userIds.length} user(s) have been deleted successfully.`,
    });
  };

  // Use useCallback to prevent unnecessary re-renders
  const handleRowSelectionChange = useCallback(
    (rowSelection: Record<string, boolean>) => {
      // Convert row selection object to array of selected user IDs
      const selectedIds = Object.keys(rowSelection)
        .filter((index) => rowSelection[index]) // Only include true values
        .map((index) => {
          const idx = Number.parseInt(index);
          return idx >= 0 && idx < users.length ? users[idx].id : null;
        })
        .filter(Boolean) as string[]; // Remove any null values

      setSelectedRows(selectedIds);
    },
    [users]
  );

  // Get unique values for filter dropdowns
  const getUniquePages = () => {
    const pages = users
      .map((user) => user.page)
      .filter((page, index, self) => page && self.indexOf(page) === index);
    return pages;
  };

  const getUniquePageTitles = () => {
    const pageTitles = users
      .map((user) => user.pageTitle)
      .filter((title, index, self) => title && self.indexOf(title) === index);
    return pageTitles;
  };

  const getUniqueRoles = () => {
    const roles = users
      .map((user) => user.role)
      .filter((role, index, self) => role && self.indexOf(role) === index);
    return roles;
  };

  // Filter the users based on all filters
  const filteredUsers = users.filter((user) => {
    const nameMatch =
      !nameFilter || user.name.toLowerCase().includes(nameFilter.toLowerCase());

    const pageMatch =
      !pageFilter ||
      (user.page && user.page.toLowerCase() === pageFilter.toLowerCase());

    const pageTitleMatch =
      !pageTitleFilter ||
      (user.pageTitle &&
        user.pageTitle.toLowerCase() === pageTitleFilter.toLowerCase());

    const roleMatch =
      !roleFilter || user.role.toLowerCase() === roleFilter.toLowerCase();

    return nameMatch && pageMatch && pageTitleMatch && roleMatch;
  });

  const resetFilters = () => {
    setNameFilter("");
    setPageFilter("");
    setPageTitleFilter("");
    setRoleFilter("");
  };

  const columns: ColumnDef<IUser>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => row.original.address || "N/A",
    },
    {
      accessorKey: "page",
      header: "Page",
      cell: ({ row }) => row.original.page || "N/A",
    },
    {
      accessorKey: "pageTitle",
      header: "Page Title",
      cell: ({ row }) => row.original.pageTitle || "N/A",
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
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          {selectedRows.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setIsDeleteMultipleUsersOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Selected (
              {selectedRows.length})
            </Button>
          )}
          <Button
            onClick={() => {
              setIsAddUserOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label htmlFor="name-filter" className="text-sm font-medium">
                  Filter by Name
                </label>
                <Input
                  id="name-filter"
                  placeholder="Search by name..."
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="page-filter" className="text-sm font-medium">
                  Filter by Page
                </label>
                <Select value={pageFilter} onValueChange={setPageFilter}>
                  <SelectTrigger id="page-filter">
                    <SelectValue placeholder="Select page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Pages</SelectItem>
                    {getUniquePages().map((page) => (
                      <SelectItem key={page} value={page}>
                        {page}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="page-title-filter"
                  className="text-sm font-medium"
                >
                  Filter by Page Title
                </label>
                <Select
                  value={pageTitleFilter}
                  onValueChange={setPageTitleFilter}
                >
                  <SelectTrigger id="page-title-filter">
                    <SelectValue placeholder="Select page title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Page Titles</SelectItem>
                    {getUniquePageTitles().map((title) => (
                      <SelectItem key={title} value={title}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="role-filter" className="text-sm font-medium">
                  Filter by Role
                </label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger id="role-filter">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {getUniqueRoles().map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <DataTable
        columns={columns}
        data={filteredUsers}
        onRowSelectionChange={handleRowSelectionChange}
      />

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

      {isDeleteMultipleUsersOpen && selectedRows.length > 0 && (
        <DeleteMultipleUsersAlert
          open={isDeleteMultipleUsersOpen}
          onOpenChange={setIsDeleteMultipleUsersOpen}
          userIds={selectedRows}
          users={users}
          onUsersDeleted={handleDeleteMultipleUsers}
          refreshUsers={refreshUsers}
        />
      )}
    </div>
  );
}
