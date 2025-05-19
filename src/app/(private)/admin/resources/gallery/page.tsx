"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { galleryApi, type GalleryItem } from "@/utils/galleryApi";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { Switch } from "@/components/ui/switch";
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
  Globe,
  EyeOff,
  ImageIcon,
  Video,
  Calendar,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { GalleryItemType } from "@/types/gallery";
import { format } from "date-fns";
import { AddGalleryItemDialog } from "@/components/admin/gallery/AddGalleryItemDialog";
import { EditGalleryItemDialog } from "@/components/admin/gallery/EditGalleryItemDialog";
import { ViewGalleryItemDialog } from "@/components/admin/gallery/ViewGalleryItemDialog";

export default function AdminGalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewItem, setViewItem] = useState<GalleryItem | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<string | null>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState<
    string | null
  >(null);

  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      const data = await galleryApi.getAdminGalleryItems();
      setGalleryItems(data);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      toast.error("Error", {
        description: "Failed to fetch gallery items",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const handleRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    const selectedRows = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    const ids = selectedRows.map(
      (index) => galleryItems[Number.parseInt(index)]._id
    );
    setSelectedIds(ids);
  };

  const handleViewItem = (item: GalleryItem) => {
    setViewItem(item);
  };

  const handleEditItem = (id: string) => {
    if (!id) {
      toast.error("Error", { description: "Invalid gallery item ID" });
      return;
    }

    setItemToEdit(id);
    setIsEditItemOpen(true);
    // Close view dialog if open
    setViewItem(null);
  };

  const handleDeleteConfirm = (id: string) => {
    if (!id) {
      toast.error("Error", { description: "Invalid gallery item ID" });
      return;
    }

    setItemToDelete(id);
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
      const success = await galleryApi.deleteGalleryItems(selectedIds);
      if (success) {
        setGalleryItems((prevItems) =>
          prevItems.filter((item) => !selectedIds.includes(item._id))
        );
        setSelectedIds([]);
      }
    } catch (error) {
      console.error("Error deleting gallery items:", error);
    } finally {
      setIsDeleting(false);
      setBulkDeleteConfirmOpen(false);
    }
  };

  const handleDeleteSingle = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      const success = await galleryApi.deleteGalleryItem(itemToDelete);
      if (success) {
        setGalleryItems((prevItems) =>
          prevItems.filter((item) => item._id !== itemToDelete)
        );
        setDeleteConfirmOpen(false);
        setItemToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting gallery item:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleVisibility = async (
    id: string,
    currentVisibility: boolean
  ) => {
    if (!id) {
      toast.error("Error", { description: "Invalid gallery item ID" });
      return;
    }

    setIsTogglingVisibility(id);
    try {
      const updatedItem = await galleryApi.toggleGalleryItemVisibility(
        id,
        !currentVisibility
      );
      setGalleryItems((prevItems) => {
        return prevItems.map((item) => {
          if (item._id === id) {
            return { ...item, isVisible: updatedItem.isVisible };
          }
          return item;
        });
      });
    } catch (error) {
      console.error("Error toggling gallery item visibility:", error);
    } finally {
      setIsTogglingVisibility(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const columns: ColumnDef<GalleryItem>[] = [
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
          <div className="relative h-10 w-10 rounded-md overflow-hidden">
            <Image
              src={row.original.image || "/placeholder.svg"}
              alt={row.original.title}
              fill
              className="object-cover"
            />
          </div>
          <span className="font-medium">{row.original.title}</span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={
            row.original.type === GalleryItemType.PHOTO
              ? "bg-blue-100 text-blue-800 border-blue-300"
              : "bg-purple-100 text-purple-800 border-purple-300"
          }
        >
          {row.original.type === GalleryItemType.PHOTO ? (
            <ImageIcon className="h-3 w-3 mr-1" />
          ) : (
            <Video className="h-3 w-3 mr-1" />
          )}
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
          <span>{formatDate(row.original.date)}</span>
        </div>
      ),
    },
    {
      id: "tags",
      header: "Tags",
      cell: ({ row }) => {
        const tags = row.original.tags || [];
        return (
          <div className="flex items-center gap-1 flex-wrap max-w-[200px]">
            {tags.length > 0 ? (
              tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-gray-100">
                  {tag}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">No tags</span>
            )}
            {tags.length > 2 && (
              <span className="text-muted-foreground text-xs">
                +{tags.length - 2} more
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "isVisible",
      header: "Visible",
      cell: ({ row }) => {
        const item = row.original;
        const id = item._id;
        const isVisible = item.isVisible;
        const isLoading = isTogglingVisibility === id;

        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={isVisible}
              onCheckedChange={() => handleToggleVisibility(id, isVisible)}
              disabled={isLoading}
              aria-label="Toggle visibility"
            />
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Badge variant={isVisible ? "outline" : "secondary"}>
                {isVisible ? (
                  <>
                    <Globe className="h-3 w-3 mr-1" /> Public
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" /> Hidden
                  </>
                )}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;

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
              <DropdownMenuItem onClick={() => handleViewItem(item)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditItem(item._id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  window.open(`/resources/gallery/${item._id}`, "_blank")
                }
              >
                <Globe className="mr-2 h-4 w-4" />
                View on Website
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleToggleVisibility(item._id, item.isVisible)}
                disabled={isTogglingVisibility === item._id}
              >
                {item.isVisible ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Hide from website
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-4 w-4" />
                    Show on website
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteConfirm(item._id)}
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
        <h2 className="text-2xl font-bold">Gallery Management</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchGalleryItems}
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
            onClick={() => setIsAddItemOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
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
          data={galleryItems}
          filterColumn="title"
          filterPlaceholder="Filter by title..."
          onRowSelectionChange={handleRowSelectionChange}
        />
      )}

      {/* Add Gallery Item Dialog */}
      <AddGalleryItemDialog
        open={isAddItemOpen}
        onOpenChange={setIsAddItemOpen}
        onSuccess={fetchGalleryItems}
      />

      {/* Edit Gallery Item Dialog */}
      <EditGalleryItemDialog
        open={isEditItemOpen}
        onOpenChange={setIsEditItemOpen}
        onSuccess={fetchGalleryItems}
        galleryItemId={itemToEdit}
      />

      {/* View Gallery Item Dialog */}
      <ViewGalleryItemDialog
        open={!!viewItem}
        onOpenChange={(open) => !open && setViewItem(null)}
        galleryItem={viewItem}
        onEdit={handleEditItem}
      />

      {/* Single Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this gallery item? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteConfirmOpen(false);
                setItemToDelete(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSingle}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog
        open={bulkDeleteConfirmOpen}
        onOpenChange={setBulkDeleteConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Delete Multiple Gallery Items
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.length} selected
              gallery items? This action cannot be undone.
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
                <>Delete {selectedIds.length} Items</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
