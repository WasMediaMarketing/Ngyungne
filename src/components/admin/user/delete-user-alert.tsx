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
import { deleteUser } from "@/utils/userApi";
import { toast } from "sonner";
import type { IUser } from "@/types/user.types";
import Spinner from "@/components/spinner";

interface DeleteUserAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IUser;
  onUserDeleted: (userId: string) => void;
  refreshUsers: () => Promise<void>;
}

export function DeleteUserAlert({
  open,
  onOpenChange,
  user,
  onUserDeleted,
  refreshUsers,
}: DeleteUserAlertProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteUser(user.id);
      onUserDeleted(user.id);
      await refreshUsers(); // Refresh the user list

      toast.success("User deleted", {
        description: "The user has been deleted successfully.",
      });

      onOpenChange(false);
    } catch (error: any) {
      console.error("Error deleting user:", error);

      toast.error("Error", {
        description:
          error.message || "Failed to delete user. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user
            <span className="font-medium"> {user.name} </span>
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
            {isLoading ? <Spinner text="Deleting..." /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
