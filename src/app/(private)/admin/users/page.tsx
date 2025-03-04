"use client";

import { useEffect, useState } from "react";
import { UserTable } from "@/components/admin/user/user-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import type { IUser } from "@/types/user.types";
import { getUsers } from "@/utils/userApi";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch users"));
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); //This line was missing a dependency array, causing the hook to not re-run when needed.  Adding an empty array [] makes it run only once on mount.  If you need it to run on other state changes, add those states to the array.

  const handleUserAdded = (newUser: IUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  const handleUserUpdated = (updatedUser: IUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  const handleUserDeleted = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <UserTable
              users={users}
              onUserAdded={handleUserAdded}
              onUserUpdated={handleUserUpdated}
              onUserDeleted={handleUserDeleted}
              refreshUsers={fetchUsers}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
