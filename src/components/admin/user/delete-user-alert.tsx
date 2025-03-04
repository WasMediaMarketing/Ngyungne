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
import { toast } from "@/components/ui/use-toast-hook";
import type { IUser } from "@/types/user.types";

interface DeleteUserAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IUser;
  onUserDeleted: (userId: string) => void;
}

export function DeleteUserAlert({
  open,
  onOpenChange,
  user,
  onUserDeleted,
}: DeleteUserAlertProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      console.log("DeleteUserAlert - Deleting user with ID:", user.id);
      await deleteUser(user.id);
      onUserDeleted(user.id);

      toast({
        title: "User deleted",
        description: "The user has been deleted successfully.",
      });

      onOpenChange(false);
    } catch (error: any) {
      console.error("Error deleting user:", error);

      toast({
        title: "Error",
        description:
          error.message || "Failed to delete user. Please try again.",
        variant: "destructive",
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
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
