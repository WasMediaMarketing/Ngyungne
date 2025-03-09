"use client";

import { DataTable } from "@/components/ui/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, MoreHorizontal } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { IContactData } from "@/types";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Extended contact type for the UI that includes user fields
interface ContactWithUserData extends IContactData {
  name?: string;
  email?: string;
  phoneNumber?: string;
  page?: string;
  pageTitle?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface ContactsTableProps {
  contacts: ContactWithUserData[];
  loading: boolean;
  onViewContact: (contact: ContactWithUserData) => void;
  onDeleteContact: (contactId: string) => void;
  onRowSelectionChange: (rowSelection: Record<string, boolean>) => void;
}

export function ContactsTable({
  contacts,
  loading,
  onViewContact,
  onDeleteContact,
  onRowSelectionChange,
}: ContactsTableProps) {
  const columns: ColumnDef<ContactWithUserData>[] = [
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
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        // If name is not available, try to get it from userId if it's an object
        const userId = row.original.userId as any;
        const displayName =
          name || (userId && userId.name ? userId.name : "Unknown");
        return <div className="font-medium">{displayName}</div>;
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const email = row.getValue("email") as string;
        // If email is not available, try to get it from userId if it's an object
        const userId = row.original.userId as any;
        const displayEmail =
          email || (userId && userId.email ? userId.email : "Unknown");
        return <div>{displayEmail}</div>;
      },
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ row }) => {
        const phone = row.getValue("phoneNumber") as string;
        // If phone is not available, try to get it from userId if it's an object
        const userId = row.original.userId as any;
        const displayPhone =
          phone ||
          (userId && userId.phoneNumber ? userId.phoneNumber : "Unknown");
        return <div>{displayPhone}</div>;
      },
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate" title={row.getValue("subject")}>
          {row.getValue("subject")}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => formatDate(row.getValue("createdAt")),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const contact = row.original;

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
              <DropdownMenuItem onClick={() => onViewContact(contact)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteContact(contact.id)}
                className="text-destructive focus:text-destructive"
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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[200px]" />
        </div>
        <div className="border rounded-md">
          <div className="h-12 border-b px-4 flex items-center">
            {Array(6)
              .fill(null)
              .map((_, i) => (
                <Skeleton key={i} className="h-4 w-full max-w-[150px] mx-4" />
              ))}
          </div>
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="h-16 border-b px-4 flex items-center">
                {Array(6)
                  .fill(null)
                  .map((_, j) => (
                    <Skeleton
                      key={j}
                      className="h-4 w-full max-w-[150px] mx-4"
                    />
                  ))}
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={contacts}
      filterColumn="subject"
      filterPlaceholder="Filter by subject..."
      onRowSelectionChange={onRowSelectionChange}
    />
  );
}
