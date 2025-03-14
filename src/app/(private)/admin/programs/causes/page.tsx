"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { causeApi, type CauseUI } from "@/utils/causeApi";
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
  AlertCircle,
  EyeOff,
  EyeIcon,
  Edit,
  Plus,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Tag,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import CauseForm from "@/components/admin/cause/cause-form";

export default function AdminCauseList() {
  const [causes, setCauses] = useState<CauseUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewCause, setViewCause] = useState<CauseUI | null>(null);
  const [editCause, setEditCause] = useState<CauseUI | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [causeToDelete, setCauseToDelete] = useState<string | null>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState<
    string | null
  >(null);
  const [isAddCauseOpen, setIsAddCauseOpen] = useState(false);

  const fetchCauses = async () => {
    setLoading(true);
    try {
      // Use the admin-specific function to get all causes including hidden ones
      const data = await causeApi.getAdminCauses();
      setCauses(data);
    } catch (error) {
      console.error("Error fetching causes:", error);
      toast.error("Error", {
        description: "Failed to fetch causes",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCauses();
  }, []);

  const handleRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    const selectedRows = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    const ids = selectedRows.map((index) =>
      causes[Number.parseInt(index)].id.toString()
    );
    setSelectedIds(ids);
  };

  const handleViewCause = (cause: CauseUI) => {
    setViewCause(cause);
  };

  const handleEditCause = (cause: CauseUI) => {
    setEditCause(cause);
  };

  const handleDeleteConfirm = (id: string) => {
    setCauseToDelete(id);
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
      const success = await causeApi.deleteCauses(selectedIds);
      if (success) {
        setCauses(causes.filter((v) => !selectedIds.includes(v.id.toString())));
        setSelectedIds([]);
        toast.success("Success", {
          description: `${selectedIds.length} causes deleted successfully`,
        });
      }
    } catch (error) {
      console.error("Error deleting causes:", error);
      toast.error("Error", {
        description: "Failed to delete causes",
      });
    } finally {
      setIsDeleting(false);
      setBulkDeleteConfirmOpen(false);
    }
  };

  const handleDeleteSingle = async () => {
    if (!causeToDelete) return;

    try {
      const success = await causeApi.deleteCause(causeToDelete);
      if (success) {
        setCauses(causes.filter((v) => v.id.toString() !== causeToDelete));
        setDeleteConfirmOpen(false);
        setCauseToDelete(null);
        toast.success("Success", {
          description: "Cause deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting cause:", error);
      toast.error("Error", {
        description: "Failed to delete cause",
      });
    }
  };

  const handleToggleVisibility = async (
    id: string,
    currentVisibility: boolean
  ) => {
    setIsUpdatingVisibility(id);
    try {
      const success = await causeApi.toggleVisibility(id, !currentVisibility);
      if (success) {
        setCauses(
          causes.map((cause) =>
            cause.id.toString() === id
              ? { ...cause, isVisible: !currentVisibility }
              : cause
          )
        );
      }
    } catch (error) {
      console.error("Error toggling cause visibility:", error);
    } finally {
      setIsUpdatingVisibility(null);
    }
  };

  const handleCauseCreated = () => {
    setIsAddCauseOpen(false);
    fetchCauses();
  };

  const handleCauseUpdated = () => {
    setEditCause(null);
    fetchCauses();
  };

  const columns: ColumnDef<CauseUI>[] = [
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
      header: "Cause",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.image && (
            <div className="relative h-10 w-10 rounded-md overflow-hidden">
              <Image
                src={row.original.image || "/placeholder.svg"}
                alt={row.original.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <div className="font-medium">{row.original.title}</div>
            <div className="text-xs text-muted-foreground">
              {row.original.subtitle}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const cause = row.original;
        return (
          <div className="w-full max-w-[180px]">
            <div className="flex justify-between text-xs mb-1">
              <span>${cause.raised.toLocaleString()}</span>
              <span>${cause.goal.toLocaleString()}</span>
            </div>
            <Progress value={cause.progress} className="h-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {cause.progress}% funded
            </div>
          </div>
        );
      },
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
      accessorKey: "daysLeft",
      header: "Timeline",
      cell: ({ row }) => {
        const cause = row.original;
        const startDate = format(new Date(cause.startDate), "MMM d, yyyy");
        const endDate = format(new Date(cause.endDate), "MMM d, yyyy");

        return (
          <div className="flex flex-col">
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <span className="text-xs">
                {startDate} - {endDate}
              </span>
            </div>
            <div className="text-xs mt-1">
              {cause.daysLeft > 0 ? `${cause.daysLeft} days left` : "Ended"}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
          {row.original.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{row.original.tags.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "isVisible",
      header: "Visibility",
      cell: ({ row }) => {
        const cause = row.original;
        const isUpdating = isUpdatingVisibility === cause.id.toString();

        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={cause.isVisible}
              onCheckedChange={() =>
                handleToggleVisibility(cause.id.toString(), cause.isVisible)
              }
              disabled={isUpdating}
              aria-label="Toggle visibility"
            />
            {isUpdating ? (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Badge variant={cause.isVisible ? "outline" : "secondary"}>
                {cause.isVisible ? (
                  <>
                    <EyeIcon className="h-3 w-3 mr-1" /> Visible
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
        const cause = row.original;

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
              <DropdownMenuItem onClick={() => handleViewCause(cause)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditCause(cause)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Cause
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleToggleVisibility(cause.id.toString(), cause.isVisible)
                }
                disabled={isUpdatingVisibility === cause.id.toString()}
              >
                {cause.isVisible ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Hide from website
                  </>
                ) : (
                  <>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    Show on website
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteConfirm(cause.id.toString())}
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
        <h2 className="text-2xl font-bold">Cause Management</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCauses}
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
            onClick={() => setIsAddCauseOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Cause
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
          data={causes}
          filterColumn="title"
          filterPlaceholder="Filter by title..."
          onRowSelectionChange={handleRowSelectionChange}
        />
      )}

      {/* Add Cause Dialog */}
      <Dialog open={isAddCauseOpen} onOpenChange={setIsAddCauseOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Cause</DialogTitle>
            <DialogDescription>
              Create a new fundraising cause with all required details.
            </DialogDescription>
          </DialogHeader>
          <CauseForm
            onSuccess={handleCauseCreated}
            onCancel={() => setIsAddCauseOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Cause Dialog */}
      {editCause && (
        <Dialog
          open={!!editCause}
          onOpenChange={(open) => !open && setEditCause(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Cause</DialogTitle>
              <DialogDescription>
                Update the details for {editCause.title}.
              </DialogDescription>
            </DialogHeader>
            <CauseForm
              cause={editCause}
              onSuccess={handleCauseUpdated}
              onCancel={() => setEditCause(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* View Cause Dialog */}
      {viewCause && (
        <Dialog open={!!viewCause} onOpenChange={() => setViewCause(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cause Details</DialogTitle>
              <DialogDescription>
                Complete information about this cause.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="flex justify-center">
                {viewCause.image ? (
                  <div className="relative h-48 w-full rounded-lg overflow-hidden">
                    <Image
                      src={viewCause.image || "/placeholder.svg"}
                      alt={viewCause.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-full rounded-lg bg-gray-200 flex items-center justify-center">
                    <span className="text-4xl text-gray-500">No Image</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{viewCause.title}</h3>
                <Badge
                  variant={viewCause.isVisible ? "outline" : "secondary"}
                  className="text-xs"
                >
                  {viewCause.isVisible ? (
                    <>
                      <EyeIcon className="h-3 w-3 mr-1" /> Visible on website
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3 mr-1" /> Hidden from website
                    </>
                  )}
                </Badge>
              </div>

              <p className="text-muted-foreground">{viewCause.subtitle}</p>

              <div className="flex flex-wrap gap-2">
                {viewCause.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Location
                  </h4>
                  <p className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    {viewCause.location}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Timeline
                  </h4>
                  <p className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    {format(
                      new Date(viewCause.startDate),
                      "MMM d, yyyy"
                    )} - {format(new Date(viewCause.endDate), "MMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Progress
                </h4>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>${viewCause.raised.toLocaleString()} raised</span>
                    <span>Goal: ${viewCause.goal.toLocaleString()}</span>
                  </div>
                  <Progress value={viewCause.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{viewCause.progress}% funded</span>
                    <span>
                      {viewCause.daysLeft > 0
                        ? `${viewCause.daysLeft} days left`
                        : "Ended"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Volunteers
                  </h4>
                  <p className="flex items-center mt-1">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    {viewCause.volunteers} volunteers
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Donors
                  </h4>
                  <p className="flex items-center mt-1">
                    <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                    {viewCause.totalDonors} donors
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  About
                </h4>
                <div className="mt-2 space-y-2">
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: viewCause.about.longDescription,
                    }}
                  />

                  {viewCause.about.objectives.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium">Objectives:</h5>
                      <ul className="list-disc pl-5 mt-1">
                        {viewCause.about.objectives.map((objective, index) => (
                          <li key={index}>{objective}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Impact
                </h4>
                <div
                  className="mt-2 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: viewCause.impact }}
                />
              </div>

              {viewCause.updates && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Updates
                  </h4>
                  <div
                    className="mt-2 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: viewCause.updates }}
                  />
                </div>
              )}

              {viewCause.faq && viewCause.faq.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    FAQ
                  </h4>
                  <div className="mt-2 space-y-4">
                    {viewCause.faq.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <h5 className="font-medium">{item.question}</h5>
                        <p className="text-sm text-muted-foreground">
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewCause.gallery && viewCause.gallery.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Gallery
                  </h4>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {viewCause.gallery.map((image, index) => (
                      <div
                        key={index}
                        className="relative h-24 rounded-md overflow-hidden"
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Gallery image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => {
                  handleEditCause(viewCause);
                  setViewCause(null);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant={viewCause.isVisible ? "outline" : "default"}
                onClick={() => {
                  handleToggleVisibility(
                    viewCause.id.toString(),
                    viewCause.isVisible
                  );
                  setViewCause(null);
                }}
              >
                {viewCause.isVisible ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide from website
                  </>
                ) : (
                  <>
                    <EyeIcon className="h-4 w-4 mr-2" />
                    Show on website
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setViewCause(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Single Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this cause? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteConfirmOpen(false);
                setCauseToDelete(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSingle}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
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
              Delete Multiple Causes
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.length} selected
              causes? This action cannot be undone and will permanently remove
              the selected causes.
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
                <>Delete {selectedIds.length} Causes</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
