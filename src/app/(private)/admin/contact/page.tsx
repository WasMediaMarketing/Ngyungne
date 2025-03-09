"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ContactsTable } from "@/components/admin/contact/contacts-table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ViewContactDialog } from "@/components/admin/contact/view-contact-dialog";
import { IContactData } from "@/types";

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

export default function ContactsAdminPage() {
  const [contacts, setContacts] = useState<ContactWithUserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [selectedContact, setSelectedContact] =
    useState<ContactWithUserData | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeletingMultiple, setIsDeletingMultiple] = useState(false);
  const [deletingSingleContactId, setDeletingSingleContactId] = useState<
    string | null
  >(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/contact", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }

      const { data } = await response.json();
      // Adjust based on your API response structure
      setContacts(data.contacts || data || []);
    } catch (error) {
      toast("Error", {
        description: "Failed to fetch contacts",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleViewContact = (contact: ContactWithUserData) => {
    setSelectedContact(contact);
    setIsViewDialogOpen(true);
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      setDeletingSingleContactId(contactId);

      const response = await fetch(`/api/contact/${contactId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }

      toast("Contact deleted", {
        description: "Contact deleted successfully",
      });
      fetchContacts();
    } catch (error) {
      toast.error("Failed to delete contact");
      console.error(error);
    } finally {
      setDeletingSingleContactId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleDeleteMultipleContacts = async () => {
    try {
      setIsDeletingMultiple(true);

      // Get the actual contact IDs from the selected rows
      const selectedContactIds = Object.keys(selectedRows)
        .filter((index) => selectedRows[index])
        .map((index) => {
          // Convert the index to a number and get the corresponding contact
          const contactIndex = parseInt(index, 10);
          return contacts[contactIndex]?.id;
        })
        .filter(Boolean); // Remove any undefined values

      if (selectedContactIds.length === 0) {
        toast.error("No contacts selected");
        return;
      }

      const response = await fetch(
        `/api/contact?contactIds=${selectedContactIds.join(",")}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete contacts");
      }

      const result = await response.json();
      toast("Contacts deleted", {
        description: `${
          result.deletedCount || selectedContactIds.length
        } contacts deleted successfully`,
      });
      setSelectedRows({});
      fetchContacts();
    } catch (error) {
      toast.error("Failed to delete contacts");
      console.error(error);
    } finally {
      setIsDeletingMultiple(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    setSelectedRows(rowSelection);
  };

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contact Messages</h1>

        <AlertDialog
          open={isDeleteDialogOpen && isDeletingMultiple}
          onOpenChange={(open) => {
            if (!open) setIsDeleteDialogOpen(false);
            if (!open) setIsDeletingMultiple(false);
          }}
        >
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              disabled={selectedCount === 0}
              onClick={() => {
                setIsDeletingMultiple(true);
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected ({selectedCount})
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                selected
                {selectedCount === 1
                  ? " contact"
                  : ` ${selectedCount} contacts`}{" "}
                from the database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteMultipleContacts}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <ContactsTable
        contacts={contacts}
        loading={loading}
        onViewContact={handleViewContact}
        onDeleteContact={(contactId) => {
          setSelectedContact(contacts.find((c) => c.id === contactId) || null);
          setDeletingSingleContactId(contactId);
          setIsDeletingMultiple(false);
          setIsDeleteDialogOpen(true);
        }}
        onRowSelectionChange={handleRowSelectionChange}
      />

      {/* View Contact Dialog */}
      <ViewContactDialog
        contact={selectedContact}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />

      {/* Delete Single Contact Dialog */}
      <AlertDialog
        open={
          isDeleteDialogOpen &&
          !isDeletingMultiple &&
          deletingSingleContactId !== null
        }
        onOpenChange={(open) => {
          if (!open) {
            setIsDeleteDialogOpen(false);
            setDeletingSingleContactId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              contact from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingSingleContactId) {
                  handleDeleteContact(deletingSingleContactId);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
