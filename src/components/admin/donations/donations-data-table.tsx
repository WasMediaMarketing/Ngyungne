"use client";

import { useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MoreHorizontal, Trash2, Eye, RefreshCw, FileDown } from "lucide-react";
import type { IDonationData } from "@/types";
import {
  getAllDonations,
  deleteDonation,
  downloadDonationReceipt,
} from "@/utils/donationApi";
import Image from "next/image";
import type { Types } from "mongoose";
import { Loader } from "@/components/common/loader";
import Spinner from "@/components/spinner";

// Helper function to safely get user name
const getUserName = (userId: Types.ObjectId | any): string => {
  if (!userId) return "Anonymous";
  if (typeof userId === "object" && userId !== null && "name" in userId) {
    return userId.name as string;
  }
  return "Anonymous";
};

// Helper function to safely get user email
const getUserEmail = (userId: Types.ObjectId | any): string => {
  if (!userId) return "";
  if (typeof userId === "object" && userId !== null && "email" in userId) {
    return userId.email as string;
  }
  return "";
};

// Update the getPageTitle function to look for page and pageTitle in userId
const getPageTitle = (donation: IDonationData): string => {
  if (typeof donation.userId === "object" && donation.userId !== null) {
    if ("pageTitle" in donation.userId) {
      return donation.userId.pageTitle as string;
    }
    if ("page" in donation.userId) {
      return donation.userId.page as string;
    }
  }
  return "Website";
};

// Helper function to safely get created date
const getCreatedDate = (donation: IDonationData): Date | null => {
  return (donation as any).createdAt || null;
};

export function DonationsDataTable() {
  const [donations, setDonations] = useState<IDonationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonationIds, setSelectedDonationIds] = useState<string[]>([]);
  const [viewDonation, setViewDonation] = useState<IDonationData | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [donationToDelete, setDonationToDelete] = useState<string | null>(null);
  const [isMultiDeleteDialogOpen, setIsMultiDeleteDialogOpen] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [pageFilter, setPageFilter] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const data = await getAllDonations();
      if (data && Array.isArray(data)) {
        setDonations(data);
      } else {
        // If data is not an array, set an empty array
        console.error("Donations data is not an array:", data);
        setDonations([]);
        toast.error("Error", {
          description: "Received invalid donation data format",
        });
      }
    } catch (error) {
      console.error("Error fetching donations:", error);
      toast("Error", {
        description: "Failed to fetch donations",
      });
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleViewDonation = (donation: IDonationData) => {
    setViewDonation(donation);
  };

  const handleDeleteConfirm = (id: string) => {
    setDonationToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDonation = async () => {
    if (!donationToDelete) return;

    setIsDeleting(true);
    try {
      const success = await deleteDonation(donationToDelete);
      if (success) {
        setDonations((prevDonations) =>
          prevDonations.filter((donation) => donation.id !== donationToDelete)
        );
        setIsDeleteDialogOpen(false);
        setDonationToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting donation:", error);
      toast.error("Error", {
        description: "Failed to delete donation",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle multiple deletion
  const handleMultiDelete = async () => {
    try {
      setIsDeleting(true);

      if (selectedDonationIds.length === 0) {
        toast.error("No donations selected");
        return;
      }

      const response = await fetch(
        `/api/donation?donationIds=${selectedDonationIds.join(",")}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete donations");
      }

      const result = await response.json();
      toast("Success", {
        description: `${
          result.deletedCount || selectedDonationIds.length
        } donations deleted successfully`,
      });

      setDonations((prevDonations) =>
        prevDonations.filter(
          (donation) => !selectedDonationIds.includes(donation.id)
        )
      );
      setSelectedDonationIds([]);
      fetchDonations();
    } catch (error) {
      console.error("Error deleting donations:", error);
      toast.error("Error", {
        description: "Failed to delete donations",
      });
    } finally {
      setIsDeleting(false);
      setIsMultiDeleteDialogOpen(false);
    }
  };

  const handleDownloadReceipt = (donation: IDonationData) => {
    downloadDonationReceipt(donation);
  };

  const handleRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    // Convert row selection to actual donation IDs
    const selectedIds = Object.keys(rowSelection)
      .filter((index) => rowSelection[index])
      .map((index) => {
        const numericIndex = parseInt(index, 10);
        return filteredDonations[numericIndex]?.id || "";
      })
      .filter((id) => id !== "");

    setSelectedDonationIds(selectedIds);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  // Filter donations based on name and page title
  // Ensure donations is an array before filtering
  const filteredDonations = Array.isArray(donations)
    ? donations.filter((donation) => {
        const donorName = getUserName(donation.userId).toLowerCase();
        const pageName = getPageTitle(donation).toLowerCase();

        const nameMatch =
          nameFilter === "" || donorName.includes(nameFilter.toLowerCase());
        const pageMatch =
          pageFilter === "" || pageName.includes(pageFilter.toLowerCase());

        return nameMatch && pageMatch;
      })
    : [];

  const columns: ColumnDef<IDonationData>[] = [
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
      accessorKey: "donor",
      header: "Donor",
      cell: ({ row }) => {
        const donation = row.original;
        const donor = getUserName(donation.userId);
        const email = getUserEmail(donation.userId);

        return (
          <div>
            <div className="font-medium" title={donor}>
              {donor}
            </div>
            {email && (
              <div className="text-sm text-muted-foreground">{email}</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("amount") || "0");
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return formatted;
      },
    },
    {
      accessorKey: "donationType",
      header: "Type",
      cell: ({ row }) => {
        return (
          <div className="capitalize">
            {row.getValue("donationType") || "Unknown"}
          </div>
        );
      },
    },
    {
      accessorKey: "donationMethod",
      header: "Method",
      cell: ({ row }) => {
        return (
          <div className="capitalize">
            {row.getValue("donationMethod") || "Unknown"}
          </div>
        );
      },
    },
    {
      id: "pageTitle",
      header: "Source",
      cell: ({ row }) => {
        return getPageTitle(row.original);
      },
    },
    {
      id: "createdAt",
      header: "Date",
      cell: ({ row }) => {
        const date = getCreatedDate(row.original);
        return date ? formatDate(date.toString()) : "N/A";
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const donation = row.original;

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
              <DropdownMenuItem onClick={() => handleViewDonation(donation)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownloadReceipt(donation)}>
                <FileDown className="mr-2 h-4 w-4" />
                Download Receipt
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteConfirm(donation.id)}
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

  const handleMultiDeleteConfirm = () => {
    setIsMultiDeleteDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Donations</CardTitle>
            <CardDescription>
              Manage donation records and transactions
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex gap-2">
              <Input
                placeholder="Filter by name..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="w-full sm:w-[180px]"
              />
              <Input
                placeholder="Filter by page..."
                value={pageFilter}
                onChange={(e) => setPageFilter(e.target.value)}
                className="w-full sm:w-[180px]"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={fetchDonations}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              {selectedDonationIds.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleMultiDeleteConfirm}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedDonationIds.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader />
        ) : (
          <DataTable
            columns={columns}
            data={filteredDonations}
            filterColumn="donor"
            filterPlaceholder="Filter donor..."
            onRowSelectionChange={handleRowSelectionChange}
          />
        )}
      </CardContent>

      {/* View Donation Dialog */}
      <Dialog
        open={viewDonation !== null}
        onOpenChange={(open) => !open && setViewDonation(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Donation Details</DialogTitle>
            <DialogDescription>
              Complete information about this donation
            </DialogDescription>
          </DialogHeader>

          {viewDonation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Donor
                  </h4>
                  <p className="text-base font-medium">
                    {getUserName(viewDonation.userId)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Amount
                  </h4>
                  <p className="text-base font-medium">
                    ${viewDonation.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Type
                  </h4>
                  <p className="text-base font-medium capitalize">
                    {viewDonation.donationType}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Method
                  </h4>
                  <p className="text-base font-medium capitalize">
                    {viewDonation.donationMethod}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Date
                  </h4>
                  <p className="text-base font-medium">
                    {formatDate(
                      getCreatedDate(viewDonation)?.toString() || null
                    )}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Source
                  </h4>
                  <p className="text-base font-medium">
                    {getPageTitle(viewDonation)}
                  </p>
                </div>
              </div>

              {/* Payment Screenshot */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Payment Screenshot
                </h4>
                <div className="relative aspect-video rounded-md overflow-hidden border group">
                  {viewDonation.screenshot ? (
                    <>
                      <Image
                        src={viewDonation.screenshot || "/placeholder.svg"}
                        alt="Payment Screenshot"
                        fill
                        className="object-contain"
                      />
                      {/* View Button (Hidden by default, shows on hover) */}
                      <Button
                        onClick={() =>
                          window.open(viewDonation.screenshot, "_blank")
                        }
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        View
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full bg-muted">
                      No screenshot available
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setViewDonation(null)}>
                  Close
                </Button>
                <Button onClick={() => handleDownloadReceipt(viewDonation)}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this donation? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteDonation}
              disabled={isDeleting}
            >
              {isDeleting ? <Spinner text="Deleting..." /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Multiple Delete Confirmation Dialog */}
      <Dialog
        open={isMultiDeleteDialogOpen}
        onOpenChange={setIsMultiDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Multiple Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedDonationIds.length}{" "}
              donations? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsMultiDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleMultiDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Spinner text="Deleting..." />
              ) : (
                "Delete All Selected"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
