"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { sliderApi } from "@/utils/sliderApi";
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
  Globe,
  EyeOff,
  Clock,
  Video,
  Link2,
  FileUp,
  ImageIcon,
  ImagePlus,
  ImagePlusIcon,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { ISlider } from "@/types/slider.types";
import { AddSliderDialog } from "@/components/admin/slider/add-slider-dialog";
import { EditSliderDialog } from "@/components/admin/slider/edit-slider-dialog";
import { MediaType, MediaSourceType } from "@/types/slider.types";

export default function AdminSliderPage() {
  const [sliders, setSliders] = useState<ISlider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewSlider, setViewSlider] = useState<ISlider | null>(null);
  const [editSlider, setEditSlider] = useState<ISlider | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [sliderToDelete, setSliderToDelete] = useState<string | null>(null);
  const [isAddSliderOpen, setIsAddSliderOpen] = useState(false);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState<
    string | null
  >(null);

  const fetchSliders = async () => {
    setLoading(true);
    try {
      const sliders = await sliderApi.getAdminSliders();
      setSliders(sliders);
    } catch (error) {
      console.error("Error fetching sliders:", error);
      toast.error("Failed to load sliders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    const selectedRows = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    const ids = selectedRows.map((index) =>
      sliders[Number.parseInt(index)]._id.toString()
    );
    setSelectedIds(ids);
  };

  const handleViewSlider = (slider: ISlider) => {
    setViewSlider(slider);
  };

  const handleEditSlider = (slider: ISlider) => {
    setEditSlider(slider);
  };

  const handleDeleteConfirm = (id: string) => {
    setSliderToDelete(id);
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
      await sliderApi.deleteSliders(selectedIds);
      setSliders((prevSliders) =>
        prevSliders.filter((s) => !selectedIds.includes(s._id.toString()))
      );
      setSelectedIds([]);
      toast.success(`${selectedIds.length} sliders deleted successfully`);
    } catch (error) {
      console.error("Error deleting sliders:", error);
      toast.error("Failed to delete sliders");
    } finally {
      setIsDeleting(false);
      setBulkDeleteConfirmOpen(false);
    }
  };

  const handleDeleteSingle = async () => {
    if (!sliderToDelete) return;

    setIsDeleting(true);
    try {
      await sliderApi.deleteSlider(sliderToDelete);
      setSliders((prevSliders) =>
        prevSliders.filter((s) => s._id.toString() !== sliderToDelete)
      );
      toast.success("Slider deleted successfully");
    } catch (error) {
      console.error("Error deleting slider:", error);
      toast.error("Failed to delete slider");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setSliderToDelete(null);
    }
  };

  const handleToggleVisibility = async (
    id: string,
    currentVisibility: boolean
  ) => {
    setIsTogglingVisibility(id);
    try {
      await sliderApi.toggleSliderVisibility(id, !currentVisibility);
      setSliders((prevSliders) => {
        return prevSliders.map((slider) => {
          if (slider._id.toString() === id) {
            return {
              ...slider,
              isVisible: !currentVisibility,
            };
          }
          return slider;
        });
      });
      toast.success(
        `Slider ${!currentVisibility ? "published" : "unpublished"}`
      );
    } catch (error) {
      console.error("Error toggling slider visibility:", error);
      toast.error("Failed to update visibility");
    } finally {
      setIsTogglingVisibility(null);
    }
  };

  const handleSliderSaved = () => {
    fetchSliders();
    setIsAddSliderOpen(false);
    setEditSlider(null);
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getMediaTypeIcon = (slider: ISlider) => {
    if (slider.media.type === MediaType.IMAGE) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />;
    } else {
      return <Video className="h-4 w-4 text-purple-500" />;
    }
  };

  const getMediaSourceIcon = (slider: ISlider) => {
    if (slider.media.sourceType === MediaSourceType.FILE) {
      return <FileUp className="h-4 w-4 text-green-500" />;
    } else {
      return <Link2 className="h-4 w-4 text-orange-500" />;
    }
  };

  const columns: ColumnDef<ISlider>[] = [
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
      cell: ({ row }) => {
        const slider = row.original;
        const mediaPreview =
          slider.media.sourceType === MediaSourceType.FILE
            ? slider.media.file
            : slider.media.url;

        return (
          <div className="flex items-center gap-2">
            {slider.media.type === MediaType.IMAGE && mediaPreview && (
              <div className="relative h-10 w-16 rounded overflow-hidden">
                <Image
                  src={mediaPreview || "/placeholder.svg"}
                  alt={slider.title || "Slider"}
                  width={64}
                  height={40}
                  className="object-cover"
                />
              </div>
            )}
            {slider.media.type === MediaType.VIDEO && (
              <div className="relative h-10 w-16 rounded overflow-hidden bg-muted flex items-center justify-center">
                <Video className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <span className="font-medium line-clamp-2">
              {slider.title || "Untitled Slider"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "media.type",
      header: "Media Type",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={
            row.original.media.type === MediaType.IMAGE
              ? "bg-blue-50 text-blue-700"
              : "bg-purple-50 text-purple-700"
          }
        >
          <div className="flex items-center gap-1">
            {row.original.media.type === MediaType.IMAGE ? (
              <ImagePlus className="h-3.5 w-3.5 mr-1" />
            ) : (
              <Video className="h-3.5 w-3.5 mr-1" />
            )}
            {row.original.media.type}
          </div>
        </Badge>
      ),
    },
    {
      accessorKey: "media.sourceType",
      header: "Source",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={
            row.original.media.sourceType === MediaSourceType.FILE
              ? "bg-green-50 text-green-700"
              : "bg-orange-50 text-orange-700"
          }
        >
          <div className="flex items-center gap-1">
            {row.original.media.sourceType === MediaSourceType.FILE ? (
              <FileUp className="h-3.5 w-3.5 mr-1" />
            ) : (
              <Link2 className="h-3.5 w-3.5 mr-1" />
            )}
            {row.original.media.sourceType}
          </div>
        </Badge>
      ),
    },
    {
      accessorKey: "order",
      header: "Order",
      cell: ({ row }) => (
        <div className="text-center font-medium">{row.original.order}</div>
      ),
    },
    {
      accessorKey: "buttonUrl",
      header: "Button",
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.buttonText ? (
            <Badge variant="outline" className="bg-amber-50 text-amber-700">
              {row.original.buttonText}
            </Badge>
          ) : (
            <span className="text-muted-foreground text-sm">No button</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "isVisible",
      header: "Status",
      cell: ({ row }) => {
        const slider = row.original;
        const id = slider._id.toString();
        const isVisible = slider.isVisible;
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
                    <Globe className="h-3 w-3 mr-1" /> Published
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" /> Draft
                  </>
                )}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span>{formatDate(row.original.createdAt as Date)}</span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const slider = row.original;

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
              <DropdownMenuItem onClick={() => handleViewSlider(slider)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditSlider(slider)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleToggleVisibility(
                    slider._id.toString(),
                    slider.isVisible
                  )
                }
                disabled={isTogglingVisibility === slider._id.toString()}
              >
                {slider.isVisible ? (
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
                onClick={() => handleDeleteConfirm(slider._id.toString())}
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
        <h2 className="text-2xl font-bold">Slider Management</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSliders}
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
            onClick={() => setIsAddSliderOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Slider
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
          data={sliders}
          filterColumn="title"
          filterPlaceholder="Filter by title..."
          onRowSelectionChange={handleRowSelectionChange}
        />
      )}

      {/* View Slider Dialog */}
      {viewSlider && (
        <Dialog
          open={!!viewSlider}
          onOpenChange={(open) => !open && setViewSlider(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Slider Details</DialogTitle>
              <DialogDescription>
                Complete information about the slider.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div className="relative h-64 w-full rounded-md overflow-hidden bg-muted">
                  {viewSlider.media.type === MediaType.IMAGE &&
                  (viewSlider.media.file || viewSlider.media.url) ? (
                    <Image
                      src={
                        viewSlider.media.sourceType === MediaSourceType.FILE
                          ? viewSlider.media.file!
                          : viewSlider.media.url!
                      }
                      alt={viewSlider.title || "Slider"}
                      fill
                      className="object-cover"
                    />
                  ) : viewSlider.media.type === MediaType.VIDEO &&
                    (viewSlider.media.file || viewSlider.media.url) ? (
                    <video
                      src={
                        viewSlider.media.sourceType === MediaSourceType.FILE
                          ? viewSlider.media.file!
                          : viewSlider.media.url!
                      }
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      {viewSlider.media.type === MediaType.IMAGE ? (
                        <ImagePlusIcon className="h-16 w-16 text-muted-foreground" />
                      ) : (
                        <Video className="h-16 w-16 text-muted-foreground" />
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold mt-2">
                    {viewSlider.title || "Untitled Slider"}
                  </h3>
                  {viewSlider.description && (
                    <p className="text-muted-foreground mt-2">
                      {viewSlider.description}
                    </p>
                  )}
                </div>

                {(viewSlider.buttonText || viewSlider.buttonUrl) && (
                  <div>
                    <h4 className="font-medium mb-2">Button</h4>
                    <div className="flex flex-col gap-1">
                      {viewSlider.buttonText && (
                        <p className="text-sm">
                          <span className="font-medium">Text:</span>{" "}
                          {viewSlider.buttonText}
                        </p>
                      )}
                      {viewSlider.buttonUrl && (
                        <p className="text-sm">
                          <span className="font-medium">URL:</span>{" "}
                          {viewSlider.buttonUrl}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Media Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <Badge
                        variant="outline"
                        className={
                          viewSlider.media.type === MediaType.IMAGE
                            ? "bg-blue-50 text-blue-700"
                            : "bg-purple-50 text-purple-700"
                        }
                      >
                        <div className="flex items-center gap-1">
                          {viewSlider.media.type === MediaType.IMAGE ? (
                            <ImagePlus className="h-3.5 w-3.5 mr-1" />
                          ) : (
                            <Video className="h-3.5 w-3.5 mr-1" />
                          )}
                          {viewSlider.media.type}
                        </div>
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Source:</span>
                      <Badge
                        variant="outline"
                        className={
                          viewSlider.media.sourceType === MediaSourceType.FILE
                            ? "bg-green-50 text-green-700"
                            : "bg-orange-50 text-orange-700"
                        }
                      >
                        <div className="flex items-center gap-1">
                          {viewSlider.media.sourceType ===
                          MediaSourceType.FILE ? (
                            <FileUp className="h-3.5 w-3.5 mr-1" />
                          ) : (
                            <Link2 className="h-3.5 w-3.5 mr-1" />
                          )}
                          {viewSlider.media.sourceType}
                        </div>
                      </Badge>
                    </div>
                    {viewSlider.media.url && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">URL:</span>
                        <span className="text-sm max-w-[250px] truncate">
                          {viewSlider.media.url}
                        </span>
                      </div>
                    )}
                    {viewSlider.media.file && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          File Path:
                        </span>
                        <span className="text-sm max-w-[250px] truncate">
                          {viewSlider.media.file}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Display Order</h4>
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700"
                    >
                      {viewSlider.order}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Visibility Status</h4>
                    <div className="flex items-center">
                      <Switch
                        checked={viewSlider.isVisible}
                        onCheckedChange={() => {
                          handleToggleVisibility(
                            viewSlider._id.toString(),
                            viewSlider.isVisible
                          );
                          setViewSlider({
                            ...viewSlider,
                            isVisible: !viewSlider.isVisible,
                          });
                        }}
                        aria-label="Toggle visibility"
                      />
                      <span className="ml-2">
                        {viewSlider.isVisible ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-1" /> Created
                    </h4>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(viewSlider.createdAt as Date)}
                    </span>
                  </div>

                  {viewSlider.updatedAt && (
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-1" /> Updated
                      </h4>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(viewSlider.updatedAt as Date)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setViewSlider(null)}>
                Close
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  setViewSlider(null);
                  handleEditSlider(viewSlider);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Slider Dialog */}
      <AddSliderDialog
        open={isAddSliderOpen}
        onOpenChange={setIsAddSliderOpen}
        onSuccess={handleSliderSaved}
      />

      {/* Edit Slider Dialog */}
      <EditSliderDialog
        open={!!editSlider}
        onOpenChange={(open) => !open && setEditSlider(null)}
        slider={editSlider}
        onSuccess={handleSliderSaved}
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
              Are you sure you want to delete this slider? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteConfirmOpen(false);
                setSliderToDelete(null);
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
              Delete Multiple Sliders
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.length} selected
              sliders? This action cannot be undone.
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
                <>Delete {selectedIds.length} Sliders</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
