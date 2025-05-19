"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createUser } from "@/utils/userApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { IUser, IUserInput } from "@/types/user.types";
import Spinner from "@/components/spinner";

const userSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  role: z.enum(["user", "admin", "volunteer", "donator"]),
  password: z.string().optional(),
  address: z.string().optional().or(z.literal("")),
  page: z.string().optional().or(z.literal("")),
  pageTitle: z.string().optional().or(z.literal("")),
});

type UserFormValues = z.infer<typeof userSchema>;

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: (user: IUser) => void;
  refreshUsers: () => Promise<void>;
}

export function AddUserDialog({
  open,
  onOpenChange,
  onUserAdded,
  refreshUsers,
}: AddUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      role: "user",
      password: "",
      address: "",
      page: "/user",
      pageTitle: "User Added by Admin",
    },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      form.reset({
        name: "",
        email: "",
        phoneNumber: "",
        role: "user",
        password: "",
        address: "",
        page: "/user",
        pageTitle: "User Added by Admin",
      });
    }
  }, [open, form]);

  const selectedRole = form.watch("role");
  const isAdmin = selectedRole === "admin";

  const onSubmit = async (data: UserFormValues) => {
    setFormError(null);
    setIsLoading(true);

    try {
      // Create a clean user input object
      const userInput: IUserInput = {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: data.role,
        // Handle optional fields properly
        ...(data.address ? { address: data.address } : {}),
        ...(data.page ? { page: data.page } : { page: "" }),
        ...(data.pageTitle ? { pageTitle: data.pageTitle } : { pageTitle: "" }),
      };

      // Only add password if it's provided and not empty
      if (data.password) {
        userInput.password = data.password;
      }

      const newUser = await createUser(userInput);

      onUserAdded(newUser);

      toast.success("Success", {
        description: "User has been created successfully.",
      });

      await refreshUsers(); // Refresh the user list

      onOpenChange(false);
      form.reset(); // Reset form after successful submission
    } catch (error: any) {
      console.error("Error in form submission:", error);
      setFormError(error.message || "Failed to create user. Please try again.");

      toast.error("Error", {
        description:
          error.message || "Failed to create user. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) form.reset(); // Reset form when dialog is closed
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new user.
          </DialogDescription>
        </DialogHeader>

        {formError && (
          <div className="bg-red-50 p-3 rounded border border-red-200 text-red-600 text-sm mb-4">
            {formError}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St, City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="volunteer">Volunteer</SelectItem>
                      <SelectItem value="donator">Donator</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) =>
                selectedRole === "admin" ? (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ) : (
                  <></>
                )
              }
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Spinner text="Creating User..." />
                ) : (
                  "Create User"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
