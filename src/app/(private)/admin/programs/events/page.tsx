"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { eventApi } from "@/utils/eventApi";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { Switch } from "@/components/ui/switch";
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
  Edit,
  AlertCircle,
  Plus,
  Calendar,
  MapPin,
  Users,
  Globe,
  EyeOff,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import EventViewDialog from "@/components/admin/events/event-view-dialog";
import EventFormDialog from "@/components/admin/events/event-form-dialog";
import type { IEvent } from "@/types";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewEvent, setViewEvent] = useState<IEvent | null>(null);
  const [editEvent, setEditEvent] = useState<IEvent | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState<
    string | null
  >(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Use the admin endpoint to get all events (visible and hidden)
      const data = await eventApi.getAdminEvents();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Error", {
        description: "Failed to fetch events",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    const selectedRows = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    const ids = selectedRows.map((index) =>
      events[Number.parseInt(index)]._id.toString()
    );
    setSelectedIds(ids);
  };

  const handleViewEvent = (event: IEvent) => {
    setViewEvent(event);
  };

  const handleEditEvent = (event: IEvent) => {
    setEditEvent(event);
  };

  const handleDeleteConfirm = (id: string) => {
    setEventToDelete(id);
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
      const success = await eventApi.deleteEvents(selectedIds);
      if (success) {
        setEvents(
          events.filter((v) => !selectedIds.includes(v._id.toString()))
        );
        setSelectedIds([]);
        toast.success("Success", {
          description: `${selectedIds.length} events deleted successfully`,
        });
      }
    } catch (error) {
      console.error("Error deleting events:", error);
      toast.error("Error", {
        description: "Failed to delete events",
      });
    } finally {
      setIsDeleting(false);
      setBulkDeleteConfirmOpen(false);
    }
  };

  const handleDeleteSingle = async () => {
    if (!eventToDelete) return;

    try {
      const success = await eventApi.deleteEvent(eventToDelete);
      if (success) {
        setEvents(events.filter((v) => v._id.toString() !== eventToDelete));
        setDeleteConfirmOpen(false);
        setEventToDelete(null);
        toast.success("Success", {
          description: "Event deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Error", {
        description: "Failed to delete event",
      });
    }
  };

  const handleToggleVisibility = async (id: string, isVisible: boolean) => {
    setIsTogglingVisibility(id);
    try {
      const success = await eventApi.toggleEventVisibility(id, isVisible);
      if (success) {
        // Update the events array while preserving the IEvent type
        const updatedEvents = events.map((event) => {
          if (event._id.toString() === id) {
            // Create a copy of the event with the updated isVisible property
            const updatedEvent = event;
            updatedEvent.isVisible = isVisible;
            return updatedEvent;
          }
          return event;
        });

        // Set the updated events array
        setEvents(updatedEvents);
      }
    } catch (error) {
      console.error("Error toggling event visibility:", error);
    } finally {
      setIsTogglingVisibility(null);
    }
  };

  const handleEventSaved = () => {
    fetchEvents();
    setIsAddEventOpen(false);
    setEditEvent(null);
  };

  const columns: ColumnDef<IEvent>[] = [
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
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.image && (
            <div className="relative h-8 w-8 rounded-md overflow-hidden">
              <Image
                src={row.original.image || "/placeholder.svg"}
                alt={row.original.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <span className="font-medium">{row.original.title}</span>
            {row.original.featured && (
              <Badge className="ml-2 bg-amber-500">Featured</Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "date",
      header: "Date & Time",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span>{format(new Date(row.original.date), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center text-muted-foreground text-xs mt-1">
            <span>{row.original.time}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex items-center">
          <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span>{row.original.location}</span>
        </div>
      ),
    },
    {
      accessorKey: "teacher.name",
      header: "Teacher",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.teacher?.image && (
            <div className="relative h-6 w-6 rounded-full overflow-hidden">
              <Image
                src={row.original.teacher.image || "/placeholder.svg"}
                alt={row.original.teacher.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <span>{row.original.teacher?.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "attending",
      header: "Capacity",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span>
            {row.original.attending || 0} / {row.original.capacity || "∞"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "isVisible",
      header: "Published",
      cell: ({ row }) => {
        const id = row.original._id.toString();
        const isVisible = row.original.isVisible;
        const isLoading = isTogglingVisibility === id;

        return (
          <div className="flex items-center">
            <Switch
              checked={isVisible}
              onCheckedChange={(checked) => handleToggleVisibility(id, checked)}
              disabled={isLoading}
              aria-label={isVisible ? "Published" : "Unpublished"}
            />
            <span className="ml-2 text-xs text-muted-foreground">
              {isVisible ? (
                <span className="flex items-center text-green-600">
                  <Globe className="h-3 w-3 mr-1" />
                  Published
                </span>
              ) : (
                <span className="flex items-center text-amber-600">
                  <EyeOff className="h-3 w-3 mr-1" />
                  Draft
                </span>
              )}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const event = row.original;

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
              <DropdownMenuItem onClick={() => handleViewEvent(event)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleToggleVisibility(event._id.toString(), !event.isVisible)
                }
              >
                {event.isVisible ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-4 w-4" />
                    Publish
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteConfirm(event._id.toString())}
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
        <h2 className="text-2xl font-bold">Event Management</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchEvents}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsAddEventOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Event
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
          data={events}
          filterColumn="title"
          filterPlaceholder="Filter by title..."
          onRowSelectionChange={handleRowSelectionChange}
        />
      )}

      {/* View Event Dialog */}
      {viewEvent && (
        <EventViewDialog
          event={viewEvent}
          open={!!viewEvent}
          onClose={() => setViewEvent(null)}
        />
      )}

      {/* Add Event Dialog */}
      <EventFormDialog
        open={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        onSaved={handleEventSaved}
      />

      {/* Edit Event Dialog */}
      {editEvent && (
        <EventFormDialog
          open={!!editEvent}
          event={editEvent}
          onClose={() => setEditEvent(null)}
          onSaved={handleEventSaved}
        />
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
              Are you sure you want to delete this event? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setEventToDelete(null);
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
              Delete Multiple Events
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.length} selected
              events? This action cannot be undone and will permanently remove
              the selected events.
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
                <>Delete {selectedIds.length} Events</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
