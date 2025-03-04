"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteMultipleUsers } from "@/utils/userApi";
import { toast } from "sonner";
import type { IUser } from "@/types/user.types";

interface DeleteMultipleUsersAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userIds: string[];
  users: IUser[];
  onUsersDeleted: (userIds: string[]) => void;
  refreshUsers: () => Promise<void>;
}

export function DeleteMultipleUsersAlert({
  open,
  onOpenChange,
  userIds,
  users,
  onUsersDeleted,
  refreshUsers,
}: DeleteMultipleUsersAlertProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      console.log(
        "DeleteMultipleUsersAlert - Deleting users with IDs:",
        userIds
      );
      await deleteMultipleUsers(userIds);
      onUsersDeleted(userIds);
      await refreshUsers(); // Refresh the user list

      toast.success("Users deleted", {
        description: `${userIds.length} user(s) have been deleted successfully.`,
      });

      onOpenChange(false);
    } catch (error: any) {
      console.error("Error deleting users:", error);

      toast.error("Error", {
        description:
          error.message || "Failed to delete users. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get the names of the users being deleted
  const userNames = users
    .filter((user) => userIds.includes(user.id))
    .map((user) => user.name)
    .join(", ");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            {userIds.length > 1 ? `${userIds.length} users` : "the user"}
            {userNames && <span className="font-medium"> ({userNames}) </span>}
            and remove their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
