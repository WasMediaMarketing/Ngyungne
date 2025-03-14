"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { bookingApi } from "@/utils/eventBookingsApi";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Trash2,
  RefreshCw,
  MoreHorizontal,
  Eye,
  AlertCircle,
  Calendar,
  User,
  Mail,
  Phone,
  Ticket,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import type { IBookEventData, IEvent, IUser } from "@/types";

export default function AdminEventBookingsPage() {
  const [bookings, setBookings] = useState<IBookEventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewBooking, setViewBooking] = useState<IBookEventData | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingApi.getBookings();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Error", {
        description: "Failed to fetch bookings",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    const selectedRows = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    const ids = selectedRows.map((index) =>
      bookings[Number.parseInt(index)]._id.toString()
    );
    setSelectedIds(ids);
  };

  const handleViewBooking = (booking: IBookEventData) => {
    setViewBooking(booking);
  };

  const handleDeleteConfirm = (id: string) => {
    setBookingToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleBulkDeleteClick = () => {
    if (!selectedIds.length) return;
    setBulkDeleteConfirmOpen(true);
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;

    setIsDeleting(true);
    try {
      const success = await bookingApi.deleteBookings(selectedIds);
      if (success) {
        setBookings(
          bookings.filter((v) => !selectedIds.includes(v._id.toString()))
        );
        setSelectedIds([]);
        toast.success("Success", {
          description: `${selectedIds.length} bookings deleted successfully`,
        });
      }
    } catch (error) {
      console.error("Error deleting bookings:", error);
      toast.error("Error", {
        description: "Failed to delete bookings",
      });
    } finally {
      setIsDeleting(false);
      setBulkDeleteConfirmOpen(false);
    }
  };

  const handleDeleteSingle = async () => {
    if (!bookingToDelete) return;

    try {
      const success = await bookingApi.deleteBooking(bookingToDelete);
      if (success) {
        setBookings(
          bookings.filter((v) => v._id.toString() !== bookingToDelete)
        );
        setDeleteConfirmOpen(false);
        setBookingToDelete(null);
        toast.success("Success", {
          description: "Booking deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Error", {
        description: "Failed to delete booking",
      });
    }
  };

  const columns: ColumnDef<IBookEventData>[] = [
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
      accessorKey: "eventId",
      header: "Event",
      cell: ({ row }) => {
        const event = row.original.eventId as unknown as IEvent;
        return (
          <div className="font-medium">{event?.title || "Unknown Event"}</div>
        );
      },
    },
    {
      accessorKey: "userId",
      header: "Attendee",
      cell: ({ row }) => {
        const user = row.original.userId as unknown as IUser;
        return (
          <div className="flex flex-col">
            <div className="flex items-center">
              <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <span>{user?.name || "Unknown User"}</span>
            </div>
            <div className="flex items-center text-muted-foreground text-xs mt-1">
              <Mail className="h-3 w-3 mr-1" />
              <span>{user?.email || "No email"}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "phoneNumber",
      header: "Contact",
      cell: ({ row }) => {
        const user = row.original.userId as unknown as IUser;
        return (
          <div className="flex items-center">
            <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span>{user?.phoneNumber || "No phone"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "TicketNumber",
      header: "Tickets",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Ticket className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span className="font-medium">{row.original.TicketNumber}</span>
        </div>
      ),
    },
    {
      accessorKey: "dietaryRequirements",
      header: "Dietary Requirements",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate">
          {row.original.dietaryRequirements || "None"}
        </div>
      ),
    },
    {
      accessorKey: "specialAccomodation",
      header: "Special Accommodations",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate">
          {row.original.specialAccomodation || "None"}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Booking Date",
      cell: ({ row }) => {
        const user = row.original.userId as unknown as IUser;
        return (
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span>
              {user?.createdAt
                ? format(new Date(user.createdAt), "MMM d, yyyy")
                : "N/A"}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const booking = row.original;

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
              <DropdownMenuItem onClick={() => handleViewBooking(booking)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteConfirm(booking._id.toString())}
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Event Bookings</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchBookings}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDeleteClick}
            disabled={!selectedIds.length || isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={bookings}
          filterColumn="userId.name"
          filterPlaceholder="Filter by name..."
          onRowSelectionChange={handleRowSelectionChange}
        />
      )}

      {/* View Booking Dialog */}
      {viewBooking && (
        <Dialog open={!!viewBooking} onOpenChange={() => setViewBooking(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                Complete information about this booking.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Event
                </h4>
                <p className="text-sm">
                  {(viewBooking.eventId as unknown as IEvent)?.title ||
                    "Unknown Event"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Attendee
                </h4>
                <p className="text-sm">
                  {(viewBooking.userId as unknown as IUser)?.name ||
                    "Unknown User"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Email
                  </h4>
                  <p className="text-sm">
                    {(viewBooking.userId as unknown as IUser)?.email ||
                      "No email"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Phone
                  </h4>
                  <p className="text-sm">
                    {(viewBooking.userId as unknown as IUser)?.phoneNumber ||
                      "No phone"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Tickets
                </h4>
                <p className="text-sm">{viewBooking.TicketNumber}</p>
              </div>

              {viewBooking.dietaryRequirements && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Dietary Requirements
                  </h4>
                  <p className="text-sm">{viewBooking.dietaryRequirements}</p>
                </div>
              )}

              {viewBooking.specialAccomodation && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Special Accommodations
                  </h4>
                  <p className="text-sm">{viewBooking.specialAccomodation}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Booking Date
                </h4>
                <p className="text-sm">
                  {(viewBooking.userId as unknown as IUser)?.createdAt
                    ? format(
                        new Date(
                          (viewBooking.userId as unknown as IUser).createdAt
                        ),
                        "MMMM d, yyyy"
                      )
                    : "N/A"}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setViewBooking(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Single Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this booking? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setBookingToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSingle}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog
        open={bulkDeleteConfirmOpen}
        onOpenChange={setBulkDeleteConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Delete Multiple Bookings
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.length} selected
              bookings? This action cannot be undone and will permanently remove
              the selected bookings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setBulkDeleteConfirmOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>Delete {selectedIds.length} Bookings</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
