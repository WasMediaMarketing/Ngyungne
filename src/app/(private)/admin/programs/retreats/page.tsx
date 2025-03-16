"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { retreatApi } from "@/utils/retreatApi";
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
  Clock,
  DollarSign,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import RetreatViewDialog from "@/components/admin/retreats/retreat-view-dialog";
import RetreatFormDialog from "@/components/admin/retreats/retreat-form-dialog";
import type { IRetreat } from "@/types";

export default function AdminRetreatsPage() {
  const [retreats, setRetreats] = useState<IRetreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewRetreat, setViewRetreat] = useState<IRetreat | null>(null);
  const [editRetreat, setEditRetreat] = useState<IRetreat | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [retreatToDelete, setRetreatToDelete] = useState<string | null>(null);
  const [isAddRetreatOpen, setIsAddRetreatOpen] = useState(false);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState<
    string | null
  >(null);

  const fetchRetreats = async () => {
    setLoading(true);
    try {
      // Use the admin endpoint to get all retreats (visible and hidden)
      const data = await retreatApi.getAdminRetreats();
      setRetreats(data);
    } catch (error) {
      console.error("Error fetching retreats:", error);
      toast.error("Error", {
        description: "Failed to fetch retreats",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRetreats();
  }, []);

  const handleRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    const selectedRows = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    const ids = selectedRows.map((index) =>
      retreats[Number.parseInt(index)]._id.toString()
    );
    setSelectedIds(ids);
  };

  const handleViewRetreat = (retreat: IRetreat) => {
    setViewRetreat(retreat);
  };

  const handleEditRetreat = (retreat: IRetreat) => {
    setEditRetreat(retreat);
  };

  const handleDeleteConfirm = (id: string) => {
    setRetreatToDelete(id);
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
      const success = await retreatApi.deleteRetreats(selectedIds);
      if (success) {
        setRetreats(
          retreats.filter((v) => !selectedIds.includes(v._id.toString()))
        );
        setSelectedIds([]);
        toast.success("Success", {
          description: `${selectedIds.length} retreats deleted successfully`,
        });
      }
    } catch (error) {
      console.error("Error deleting retreats:", error);
      toast.error("Error", {
        description: "Failed to delete retreats",
      });
    } finally {
      setIsDeleting(false);
      setBulkDeleteConfirmOpen(false);
    }
  };

  const handleDeleteSingle = async () => {
    if (!retreatToDelete) return;

    try {
      const success = await retreatApi.deleteRetreat(retreatToDelete);
      if (success) {
        setRetreats(
          retreats.filter((v) => v._id.toString() !== retreatToDelete)
        );
        setDeleteConfirmOpen(false);
        setRetreatToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting retreat:", error);
    }
  };

  const handleToggleVisibility = async (id: string, isVisible: boolean) => {
    setIsTogglingVisibility(id);
    try {
      const success = await retreatApi.toggleRetreatVisibility(id, isVisible);
      if (success) {
        // Update the retreats array while preserving the IRetreat type
        const updatedRetreats = retreats.map((retreat) => {
          if (retreat._id.toString() === id) {
            // Create a copy of the retreat with the updated isVisible property
            const updatedRetreat = retreat;
            updatedRetreat.isVisible = isVisible;
            return updatedRetreat;
          }
          return retreat;
        });

        // Set the updated retreats array
        setRetreats(updatedRetreats);
      }
    } catch (error) {
      console.error("Error toggling retreat visibility:", error);
    } finally {
      setIsTogglingVisibility(null);
    }
  };

  const handleRetreatSaved = () => {
    fetchRetreats();
    setIsAddRetreatOpen(false);
    setEditRetreat(null);
  };

  const columns: ColumnDef<IRetreat>[] = [
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
        <div className="font-medium">{row.original.title}</div>
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
      header: "Date",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span>{format(new Date(row.original.date), "MMM d, yyyy")}</span>
        </div>
      ),
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span>{row.original.duration}</span>
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
      accessorKey: "participants",
      header: "Participants",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span>{row.original.participants}</span>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <div className="flex items-center">
          <DollarSign className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span>{row.original.price}</span>
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
        const retreat = row.original;

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
              <DropdownMenuItem onClick={() => handleViewRetreat(retreat)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditRetreat(retreat)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleToggleVisibility(
                    retreat._id.toString(),
                    !retreat.isVisible
                  )
                }
              >
                {retreat.isVisible ? (
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
                onClick={() => handleDeleteConfirm(retreat._id.toString())}
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
        <h2 className="text-2xl font-bold">Retreat Management</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRetreats}
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
            onClick={() => setIsAddRetreatOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Retreat
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
          data={retreats}
          filterColumn="title"
          filterPlaceholder="Filter by title..."
          onRowSelectionChange={handleRowSelectionChange}
        />
      )}

      {/* View Retreat Dialog */}
      {viewRetreat && (
        <RetreatViewDialog
          retreat={viewRetreat}
          open={!!viewRetreat}
          onClose={() => setViewRetreat(null)}
        />
      )}

      {/* Add Retreat Dialog */}
      <RetreatFormDialog
        open={isAddRetreatOpen}
        onClose={() => setIsAddRetreatOpen(false)}
        onSaved={handleRetreatSaved}
      />

      {/* Edit Retreat Dialog */}
      {editRetreat && (
        <RetreatFormDialog
          open={!!editRetreat}
          retreat={editRetreat}
          onClose={() => setEditRetreat(null)}
          onSaved={handleRetreatSaved}
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
              Are you sure you want to delete this retreat? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setRetreatToDelete(null);
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
              Delete Multiple Retreats
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.length} selected
              retreats? This action cannot be undone and will permanently remove
              the selected retreats.
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
                <>Delete {selectedIds.length} Retreats</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
