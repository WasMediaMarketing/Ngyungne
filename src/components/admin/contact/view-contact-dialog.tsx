"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { IContactData } from "@/types";
import { formatDate } from "@/lib/utils";

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

interface ViewContactDialogProps {
  contact: ContactWithUserData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewContactDialog({
  contact,
  open,
  onOpenChange,
}: ViewContactDialogProps) {
  if (!contact) return null;

  // Handle cases where user data might be in the userId field
  const userId = contact.userId as any;
  const name =
    contact.name || (userId && userId.name ? userId.name : "Unknown");
  const email =
    contact.email || (userId && userId.email ? userId.email : "Unknown");
  const phoneNumber =
    contact.phoneNumber ||
    (userId && userId.phoneNumber ? userId.phoneNumber : "Unknown");
  const page =
    contact.page || (userId && userId.page ? userId.page : undefined);
  const pageTitle =
    contact.pageTitle ||
    (userId && userId.pageTitle ? userId.pageTitle : undefined);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Message</DialogTitle>
          <DialogDescription>
            Received on {formatDate(contact.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="font-semibold">Name:</div>
            <div className="col-span-2">{name}</div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="font-semibold">Email:</div>
            <div className="col-span-2">{email}</div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="font-semibold">Phone:</div>
            <div className="col-span-2">{phoneNumber}</div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="font-semibold">Subject:</div>
            <div className="col-span-2">{contact.subject}</div>
          </div>

          {page && (
            <div className="grid grid-cols-3 gap-2">
              <div className="font-semibold">Page:</div>
              <div className="col-span-2">{pageTitle || page}</div>
            </div>
          )}

          <div className="space-y-2">
            <div className="font-semibold">Message:</div>
            <div className="p-3 bg-muted rounded-md whitespace-pre-wrap">
              {contact.message}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
